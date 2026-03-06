/**
 * EMMI BOT IDE — Main Application Controller
 * Replaces blocklino.js with a clean ES module pattern.
 * No jQuery dependency — uses vanilla DOM APIs.
 */

import { Modal } from './modal.js';
import { SerialBridge } from './serial.js';
import { CompilerBridge } from './compiler.js';
import { AIChat } from './ai-chat.js';

/* ==============================
   Globals used by Blockly
   ============================== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

export const App = {
    selectedToolbox: 'toolbox_arduino_all',
    selectedCard: 'nano',
    workspace: null,
    editor: null,
    contentMode: 'blocks', // 'blocks' or 'code'

    async init() {
        this.isInitializing = true;
        await Code.loadLanguageScripts();
        Code.initLanguage();
        await this.loadConfig();

        // Inject Blockly
        try {
            this.workspace = Blockly.inject('content_blocks', {
                grid: { snap: true },
                sounds: true,
                media: 'media/',
                toolbox: this.buildToolbox(),
                zoom: { controls: true, wheel: true }
            });
        } catch (e) {
            console.error('Failed to inject Blockly:', e);
            // Fallback to basic toolbox if custom toolbox crashed
            try {
                this.workspace = Blockly.inject('content_blocks', {
                    media: 'media/',
                    toolbox: document.getElementById('toolbox') || '<xml id="toolbox"></xml>'
                });
            } catch (fallbackErr) {
                console.error('Fatal Blockly fallback error:', fallbackErr);
            }
        }

        window.BlocklyDuino = this;
        if (this.workspace) Blockly.mainWorkspace = this.workspace;

        this.bindEvents();
        setTimeout(() => { this.isInitializing = false; }, 1000);

        this.workspace.render();

        // Force Blockly to recalculate after layout renders
        for (const delay of [100, 300, 600, 1200]) {
            setTimeout(() => Blockly.svgResize(this.workspace), delay);
        }
        window.addEventListener('resize', () => Blockly.svgResize(this.workspace));

        // Fix toolbox category clicks so flyout works properly
        // Blockly 3.20200924.3 new-style toolbox requires setSelectedItem to show flyout
        for (const delay of [200, 600, 1200]) {
            setTimeout(() => this.fixToolboxClicks(), delay);
        }

        // Change listener for code preview
        this.workspace.addChangeListener(() => this.renderCodePreview());

        // Init ACE editor
        ace.require('ace/ext/language_tools');
        this.editor = ace.edit('content_code');
        this.editor.setTheme('ace/theme/sqlserver');
        this.editor.session.setTabSize(2);
        this.editor.setShowPrintMargin(false);

        // Make editor globally accessible for AI chat code insertion
        window.editor = this.editor;

        this.loadFile();
        window.addEventListener('unload', () => this.backupBlocks());
    },

    /* ── Config Loading ────────────── */
    async loadConfig() {
        const card = localStorage.card;
        const prog = localStorage.prog;

        if (!card) {
            localStorage.card = this.selectedCard;
            localStorage.prog = profile[this.selectedCard].prog;
            localStorage.toolbox = this.selectedToolbox;
            $('#boards').value = this.selectedCard;
            await this.loadToolboxDefinition(this.selectedToolbox);
        } else {
            const toolbox = localStorage.toolbox || this.selectedToolbox;
            this.selectedToolbox = toolbox;
            $('#boards').value = card;
            await this.loadToolboxDefinition(toolbox);
        }

        const content = localStorage.content;
        if (!content) {
            localStorage.content = 'on';
            this.contentMode = 'blocks';
        } else {
            this.contentMode = content === 'on' ? 'blocks' : 'code';
            if (this.contentMode === 'code') {
                this.showCodeEditor();
            }
        }

        if (prog === 'python') {
            const binBtn = $('#btn_bin');
            if (binBtn) binBtn.style.display = 'none';
        }
    },

    /* ── Toolbox Loading (ASYNC) ────── */
    async loadToolboxDefinition(toolboxFile) {
        const url = `/toolbox/${toolboxFile}.xml`;
        try {
            const response = await fetch(url);
            if (!response.ok) { this.removeToolbox(); return; }
            const text = await response.text();
            if (!text) { this.removeToolbox(); return; }

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            const toolboxNode = xmlDoc.querySelector('toolbox');
            if (!toolboxNode) { this.removeToolbox(); return; }

            // Set category names from Blockly.Msg inside the parsed XML document itself
            xmlDoc.querySelectorAll('category').forEach(cat => {
                if (!cat.getAttribute('id')) {
                    cat.setAttribute('id', cat.getAttribute('name'));
                    if (cat.getAttribute('name') && Blockly.Msg[cat.getAttribute('name')]) {
                        cat.setAttribute('name', Blockly.Msg[cat.getAttribute('name')]);
                    }
                }
            });

            // Store in memory, do NOT inject into HTML document body, prevents lowercasing attributes!
            window.toolboxXmlDOM = xmlDoc;

        } catch (e) {
            console.warn('loadToolboxDefinition failed:', url, e);
            this.removeToolbox();
        }
    },

    removeToolbox() {
        window.toolboxXmlDOM = null;
    },

    updateAIToolboxCategory() {
        try {
            if (!window.toolboxXmlDOM || !window.AIChat || typeof window.AIChat.getGeneratedBlocks !== 'function') return;
            const blocks = window.AIChat.getGeneratedBlocks();
            if (!blocks || blocks.length === 0) return;

            const toolboxNode = window.toolboxXmlDOM.querySelector('toolbox');
            if (!toolboxNode) return;

            let aiCat = window.toolboxXmlDOM.querySelector('category[id="catAI"]');
            if (!aiCat) {
                aiCat = window.toolboxXmlDOM.createElement('category');
                aiCat.setAttribute('id', 'catAI');
                aiCat.setAttribute('name', 'AI Generated');
                aiCat.setAttribute('colour', '260');
                toolboxNode.appendChild(aiCat);
            }
            while (aiCat.firstChild) { aiCat.removeChild(aiCat.firstChild); }
            blocks.forEach(dom => {
                aiCat.appendChild(dom.cloneNode(true));
            });

            // Add to all param level ids if needed
            [1, 2, 3, 4, '1', '2', '3', '4'].forEach(lvl => {
                const catEl = window.toolboxXmlDOM.querySelector(`parametre[id="defaultCategories${lvl}"]`);
                if (catEl) {
                    let text = catEl.textContent || catEl.innerHTML || '';
                    if (text && !text.split(',').includes('catAI')) {
                        catEl.textContent = text + ',catAI';
                    }
                }
            });

            if (localStorage.toolboxids) {
                const arr = localStorage.toolboxids.split(',');
                if (!arr.includes('catAI')) {
                    arr.push('catAI');
                    localStorage.toolboxids = arr.join(',');
                }
            }
        } catch (e) {
            console.error("AI Toolbox Update Error: ", e);
        }
    },

    refreshToolboxLevel() {
        this.updateAIToolboxCategory();
        const level = localStorage.level || 1;
        this.buildToolboxLevel(level);
    },

    buildToolbox() {
        this.updateAIToolboxCategory();
        if (!window.toolboxXmlDOM) return '<xml id="toolbox"></xml>';

        const toolboxNode = window.toolboxXmlDOM.querySelector('toolbox');
        if (!toolboxNode) return '<xml id="toolbox"></xml>';

        let loadIds = localStorage.toolboxids;
        if (!loadIds) {
            const def = window.toolboxXmlDOM.querySelector('parametre[id="defaultCategories' + (localStorage.level || '1') + '"]');
            if (def) {
                loadIds = def.innerHTML || def.textContent;
            } else {
                const serializer = new XMLSerializer();
                let fullOutput = '<xml id="toolbox">';
                for (const child of toolboxNode.childNodes) {
                    fullOutput += serializer.serializeToString(child);
                }
                fullOutput += '</xml>';
                return fullOutput.replace(/<([a-zA-Z0-9_-]+)([^>]*)\/>/g, '<$1$2></$1>');
            }
        }

        let xml = '<xml id="toolbox">';
        const ids = loadIds.split(',');
        let hasValidCategory = false;
        const serializer = new XMLSerializer();

        for (const id of ids) {
            if (!id.trim()) continue;
            // Searching by ID matching the original logic (or name if id wasn't set somehow)
            const el = window.toolboxXmlDOM.querySelector(`category[id="${id.trim()}"]`) || window.toolboxXmlDOM.querySelector(`category[name="${id.trim()}"]`);
            if (el) {
                xml += serializer.serializeToString(el);
                hasValidCategory = true;
            }
        }
        xml += '</xml>';
        xml = xml.replace(/<([a-zA-Z0-9_-]+)([^>]*)\/>/g, '<$1$2></$1>');

        if (hasValidCategory) return xml;

        // Fallback
        let fullOutputFallback = '<xml id="toolbox">';
        for (const child of toolboxNode.childNodes) fullOutputFallback += serializer.serializeToString(child);
        fullOutputFallback += '</xml>';
        return fullOutputFallback.replace(/<([a-zA-Z0-9_-]+)([^>]*)\/>/g, '<$1$2></$1>');
    },

    /** Single DRY function for all 3 levels */
    buildToolboxLevel(level) {
        this.updateAIToolboxCategory();
        if (!window.toolboxXmlDOM) return;
        const toolboxNode = window.toolboxXmlDOM.querySelector('toolbox');
        if (!toolboxNode) return;

        const catEl = window.toolboxXmlDOM.querySelector(`parametre[id="defaultCategories${level}"]`);
        const loadIds = catEl ? (catEl.innerHTML || catEl.textContent) : '';

        const serializer = new XMLSerializer();
        let xmlToInject;

        if (!loadIds) {
            xmlToInject = '<xml id="toolbox">';
            for (const child of toolboxNode.childNodes) xmlToInject += serializer.serializeToString(child);
            xmlToInject += '</xml>';
        } else {
            localStorage.toolboxids = loadIds;
            localStorage.level = level;

            let xml = '<xml id="toolbox">';
            const ids = loadIds.split(',');
            let hasValidCategory = false;

            for (const id of ids) {
                if (!id.trim()) continue;
                const el = window.toolboxXmlDOM.querySelector(`category[id="${id.trim()}"]`) || window.toolboxXmlDOM.querySelector(`category[name="${id.trim()}"]`);
                if (el) {
                    xml += serializer.serializeToString(el);
                    hasValidCategory = true;
                }
            }
            xml += '</xml>';

            if (hasValidCategory) {
                xmlToInject = xml;
            } else {
                xmlToInject = '<xml id="toolbox">';
                for (const child of toolboxNode.childNodes) xmlToInject += serializer.serializeToString(child);
                xmlToInject += '</xml>';
            }
        }

        try {
            xmlToInject = xmlToInject.replace(/<([a-zA-Z0-9_-]+)([^>]*)\/>/g, '<$1$2></$1>');
            Blockly.getMainWorkspace().updateToolbox(xmlToInject);
            Blockly.svgResize(this.workspace);
            // Re-wire toolbox clicks after toolbox rebuild
            setTimeout(() => this.fixToolboxClicks(), 300);
        } catch (e) {
            console.error('Failed to update toolbox level', e);
        }
    },

    /* ── Toolbox Flyout Fix ─────────── */
    fixToolboxClicks() {
        const toolbox = this.workspace && this.workspace.toolbox_;
        if (!toolbox) return;

        // Ensure all categories with blocks are selectable
        const _makeSelectable = (item) => {
            if (item.getContents && item.getContents()?.length > 0) {
                item.isSelectable = () => true;
            }
            if (item.contents_ && Array.isArray(item.contents_)) {
                item.contents_.forEach(child => _makeSelectable(child));
            }
        };
        if (toolbox.contents_) toolbox.contents_.forEach(item => _makeSelectable(item));

        // Monkey-patch setSelectedItem to ensure flyout always updates
        if (!toolbox._emmiPatched) {
            toolbox._emmiPatched = true;
            const originalSet = toolbox.setSelectedItem.bind(toolbox);
            toolbox.setSelectedItem = (item) => {
                originalSet(item);
                // Force update flyout if item has blocks
                if (item && item.getContents && item.getContents().length > 0) {
                    if (toolbox.updateFlyout_) {
                        toolbox.updateFlyout_(null, item);
                    } else if (toolbox.flyout_) {
                        toolbox.flyout_.show(item.getContents());
                    }
                }
            };
        }
    },

    /* ── Code Preview ────────────── */
    renderCodePreview() {
        const prog = localStorage.prog || 'arduino';
        const previewEl = $('#pre_previewArduino');
        if (!previewEl) return;

        if (prog === 'arduino' || prog === '') {
            try {
                const code = Blockly.Arduino.workspaceToCode(this.workspace);
                previewEl.textContent = code;
                previewEl.innerHTML = prettyPrintOne(previewEl.innerHTML, 'cpp');

                if (this.editor && (!localStorage.content || localStorage.content === 'on')) {
                    this.editor.setValue(code, -1);
                }
            } catch (e) {
                console.error("[EMMI] Code generation error:", e);
                previewEl.textContent = `Error generating code: ${e.message}`;
            }
        } else if (prog === 'micropython') {
            try {
                if (window.Blockly && Blockly.Python) {
                    // Auto-stub any missing python block generators to prevent crashes
                    const allBlocks = this.workspace.getAllBlocks(false);
                    allBlocks.forEach(block => {
                        if (block && block.type && !Blockly.Python[block.type]) {
                            Blockly.Python[block.type] = function (b) {
                                const isOutput = b.outputConnection && b.outputConnection.targetConnection;
                                return isOutput ? [`${b.type}()`, Blockly.Python.ORDER_NONE] : `${b.type}()\n`;
                            };
                        }
                    });

                    const code = Blockly.Python.workspaceToCode(this.workspace);
                    previewEl.textContent = code;
                    previewEl.innerHTML = prettyPrintOne(previewEl.innerHTML, 'py');

                    if (this.editor && (!localStorage.content || localStorage.content === 'on')) {
                        this.editor.setValue(code, -1);
                    }
                } else {
                    previewEl.textContent = "Python generator not loaded.";
                }
            } catch (e) {
                console.error("[EMMI] Python Code generation error:", e);
                previewEl.textContent = `Error generating Python code: ${e.message}`;
            }
        } else if (prog === 'java') {
            try {
                if (window.Blockly && Blockly.Java) {
                    // Auto-stub any missing Java block generators to prevent crashes
                    const allBlocks = this.workspace.getAllBlocks(false);
                    allBlocks.forEach(block => {
                        if (block && block.type && !Blockly.Java[block.type]) {
                            Blockly.Java[block.type] = function (b) {
                                const isOutput = b.outputConnection && b.outputConnection.targetConnection;
                                return isOutput ? [`${b.type}()`, Blockly.Java.ORDER_NONE] : `${b.type}();\n`;
                            };
                        }
                    });

                    const code = Blockly.Java.workspaceToCode(this.workspace);
                    previewEl.textContent = code;
                    previewEl.innerHTML = prettyPrintOne(previewEl.innerHTML, 'java');

                    if (this.editor && (!localStorage.content || localStorage.content === 'on')) {
                        this.editor.setValue(code, -1);
                    }
                } else {
                    previewEl.textContent = "Java generator not loaded.";
                }
            } catch (e) {
                console.error("[EMMI] Java Code generation error:", e);
                previewEl.textContent = `Error generating Java code: ${e.message}`;
            }
        } else {
            // For other unsupported ones yet
            previewEl.textContent = "Preview not available for this language.";
        }
    },

    /* ── Board Switching ──────────── */
    async changeCard(event) {
        if (event && !event.isTrusted) return;
        if (this.isInitializing) return;
        this.backupBlocks();
        const card = localStorage.card;
        const newCard = $('#boards').value;
        const newProg = window.profile[newCard]?.prog;

        if (window.profile[newCard]?.cpu !== window.profile[card]?.cpu) {
            if (!confirm(`Switch to ${window.profile[newCard]?.description}?`)) {
                $('#boards').value = card;
                return;
            }

            if (newProg !== 'python') {
                localStorage.prog = newProg;

                // Determine toolbox based on CPU
                const cpuToolboxMap = {
                    'esp8266': 'toolbox_arduino_all-esp8266',
                    'esp32': 'toolbox_arduino_all-esp32',
                    'atmega328p-x': 'toolbox_arduino_all-mrtx',
                    'mrtnode-esp32': 'toolbox_arduino_all-mrtnode',
                    'mrtnodesensor-esp32': 'toolbox_arduino_all-mrtnodesensor',
                    'mrtnodev1-esp32': 'toolbox_arduino_all-mrtnodev1',
                    'mrtnodeflipper-esp32': 'toolbox_arduino_all-mrtnodeflipper'
                };
                const newToolbox = cpuToolboxMap[window.profile[newCard].cpu] || 'toolbox_arduino_all';

                localStorage.toolbox = newToolbox;
                this.workspace.clear();

                // New start block
                const startXml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="base_setup_loop" x="-4" y="48"></block></xml>';
                this.loadBlocks(startXml);

                await this.loadToolboxDefinition(newToolbox);
                Blockly.getMainWorkspace().updateToolbox(this.buildToolbox());

                // Apply current level
                const level = localStorage.level || 1;
                this.buildToolboxLevel(level);
                this.workspace.render();
            } else {
                const newToolbox = window.profile[newCard].cpu === 'cortexM0' ? 'toolbox_microbit' : 'toolbox_lycee';
                localStorage.prog = newProg;
                localStorage.toolbox = newToolbox;
                this.workspace.clear();
                await this.loadToolboxDefinition(newToolbox);
                Blockly.getMainWorkspace().updateToolbox(this.buildToolbox());
                this.workspace.render();
            }
        }
        localStorage.card = newCard;
    },

    /* ── Blocks Management ─────────── */
    loadBlocks(defaultXml) {
        if (defaultXml) {
            const xml = Blockly.Xml.textToDom(defaultXml);
            Blockly.Xml.domToWorkspace(xml, this.workspace);
        } else {
            const saved = localStorage.loadOnceBlocks;
            if (saved) {
                delete localStorage.loadOnceBlocks;
                const xml = Blockly.Xml.textToDom(saved);
                Blockly.Xml.domToWorkspace(xml, this.workspace);
            }
        }
    },

    backupBlocks() {
        if (typeof Blockly !== 'undefined' && localStorage) {
            const xml = Blockly.Xml.workspaceToDom(this.workspace);
            localStorage.loadOnceBlocks = Blockly.Xml.domToText(xml);
        }
    },

    discard() {
        const count = this.workspace.getAllBlocks().length;
        if (count < 4 || confirm('Delete all blocks?')) {
            this.workspace.clear();
            this.workspace.render();
        }
    },

    undo() {
        if (this.contentMode === 'blocks') {
            Blockly.mainWorkspace.undo(0);
        } else {
            this.editor.undo();
        }
    },

    redo() {
        if (this.contentMode === 'blocks') {
            Blockly.mainWorkspace.undo(1);
        } else {
            this.editor.redo();
        }
    },

    /* ── View Toggle ──────────────── */
    toggleBlockCode() {
        if (this.contentMode === 'blocks') {
            this.showCodeEditor();
        } else {
            this.showBlocks();
        }
    },

    showCodeEditor() {
        this.contentMode = 'code';
        localStorage.content = 'off';

        // Copy generated code to editor
        const code = $('#pre_previewArduino')?.textContent || '';
        this.editor.setValue(code, 1);

        const prog = localStorage.prog;
        this.editor.session.setMode(prog === 'python' ? 'ace/mode/python' : 'ace/mode/c_cpp');
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        $('#content_blocks').style.display = 'none';
        $('#content_code').style.display = 'block';
        $('#btn_preview').style.display = 'none';
        $('#btn_search').style.display = 'inline-flex';
        $('#codeORblock').classList.add('active');
        $('#codeORblock').querySelector('span').className = 'fa fa-code';
    },

    showBlocks() {
        this.contentMode = 'blocks';
        localStorage.content = 'on';

        $('#content_blocks').style.display = 'block';
        $('#content_code').style.display = 'none';
        $('#btn_preview').style.display = 'inline-flex';
        $('#btn_search').style.display = 'none';
        $('#codeORblock').classList.remove('active');
        $('#codeORblock').querySelector('span').className = 'fa fa-puzzle-piece';

        setTimeout(() => Blockly.svgResize(this.workspace), 100);
    },

    /* ── File Operations ─────────── */
    loadFile() {
        const urlFile = this.getUrlParam('url', '');
        if (urlFile) {
            // Ensure path is properly formatted if it was passed with ./ prefix previously
            let fetchUrl = urlFile;
            if (fetchUrl.startsWith('./')) fetchUrl = fetchUrl.substring(2);
            if (!fetchUrl.startsWith('/')) fetchUrl = '/' + fetchUrl;

            if (fetchUrl.endsWith('.py') || fetchUrl.endsWith('.ino')) {
                fetch(fetchUrl)
                    .then(r => r.text())
                    .then(data => {
                        this.showCodeEditor();
                        this.editor.session.setMode(fetchUrl.endsWith('.py') ? 'ace/mode/python' : 'ace/mode/c_cpp');
                        this.editor.setValue(data, 1);
                    });
            }
            fetch(fetchUrl)
                .then(r => r.text())
                .then(data => this.loadBlocks(data))
                .catch(() => this.loadBlocks());
        } else {
            this.loadBlocks();
        }
    },

    handleFileLoad(event) {
        const files = event.target.files;
        if (files.length !== 1) return;

        const reader = new FileReader();
        reader.onloadend = (e) => {
            const result = e.target.result;
            const name = files[0].name;
            $('#title-project-name').value = name.substring(0, name.lastIndexOf('.'));

            if (name.endsWith('.ino') || name.endsWith('.py')) {
                this.showCodeEditor();
                this.editor.session.setMode(name.endsWith('.py') ? 'ace/mode/python' : 'ace/mode/c_cpp');
                this.editor.setValue(result, 1);
            }

            try {
                const xml = Blockly.Xml.textToDom(result);
                this.workspace.clear();
                Blockly.Xml.domToWorkspace(xml, this.workspace);
                this.workspace.render();
            } catch (err) {
                // Not XML — file was loaded into editor already
            }
        };
        reader.readAsText(files[0]);
    },

    /** Unified save function */
    saveFile(ext) {
        const projectName = $('#title-project-name').value || 'emmicode';
        let data, mime;

        if (ext === 'bloc' && this.contentMode === 'blocks') {
            const xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
            data = Blockly.Xml.domToPrettyText(xml);
            mime = 'text/xml';
        } else if (ext === 'ino') {
            data = this.contentMode === 'code' ? this.editor.getValue() : ($('#pre_previewArduino')?.textContent || '');
            mime = 'text/plain';
        } else if (ext === 'py') {
            data = this.contentMode === 'code' ? this.editor.getValue() : ($('#pre_previewArduino')?.textContent || '');
            mime = 'text/plain';
        }

        const blob = new Blob([data], { type: mime });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${projectName}.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
    },

    /* ── Examples ────────────────── */
    async buildExamples() {
        try {
            const res = await fetch('/examples/examples.json');
            const data = await res.json();
            const tbody = $('#includedContent');
            tbody.innerHTML = '';

            data.forEach(example => {
                if (example.visible) {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td><a href="?url=/examples/${example.source_url}">${example.source_text}</a></td>`;
                    tbody.appendChild(tr);
                }
            });
        } catch (e) {
            console.warn('Failed to load examples:', e);
        }
    },

    /* ── Workspace Capture ─────────── */
    captureWorkspace() {
        const ws = this.workspace.svgBlockCanvas_.cloneNode(true);
        ws.removeAttribute('width');
        ws.removeAttribute('height');
        ws.removeAttribute('transform');

        const styleElem = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        styleElem.textContent = Blockly.Css.CONTENT.join('');
        ws.insertBefore(styleElem, ws.firstChild);

        const bbox = this.workspace.svgBlockCanvas_.getBBox();
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(bbox.width + 10);
        canvas.height = Math.ceil(bbox.height + 10);

        const ctx = canvas.getContext('2d');
        const xml = new XMLSerializer().serializeToString(ws);
        const svgStr = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${bbox.width}" height="${bbox.height}" viewBox="${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}"><rect width="100%" height="100%" fill="white"></rect>${xml}</svg>`;

        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
        img.onload = () => {
            ctx.drawImage(img, 5, 5);
            const a = document.createElement('a');
            a.download = `capture${Date.now()}.png`;
            a.href = canvas.toDataURL('image/png', 1);
            a.click();
        };
    },

    /* ── Helpers ──────────────────── */
    getUrlParam(name, defaultValue) {
        const val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
        return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
    },

    /* ── Event Binding ─────────────── */
    bindEvents() {
        // Level dropdown
        $('#btn_level_main').addEventListener('click', (e) => {
            e.stopPropagation();
            const dd = $('#levelDropdown');
            dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', () => {
            $('#levelDropdown').style.display = 'none';
        });
        $$('#levelDropdown .dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const level = item.dataset.level;
                const levelLabel = (typeof MSG !== 'undefined' && MSG.labelToolboxDefinition) ? MSG.labelToolboxDefinition.replace(':', '').trim() : 'Level';
                $('#levelText').textContent = `${levelLabel} ${level}`;
                this.buildToolboxLevel(level);
            });
        });

        // Language
        $('#languageMenu').addEventListener('change', () => {
            localStorage.lang = $('#languageMenu').value;
            location.reload();
        });

        // File operations
        $('#btn_new').addEventListener('click', () => this.discard());
        $('#btn_undo').addEventListener('click', () => this.undo());
        $('#btn_redo').addEventListener('click', () => this.redo());
        $('#btn_saveXML').addEventListener('click', () => {
            if (this.contentMode === 'blocks') this.saveFile('bloc');
            else if (localStorage.prog === 'arduino') this.saveFile('ino');
            else this.saveFile('py');
        });
        $('#btn_fakeload').addEventListener('click', () => $('#load').click());
        $('#load').addEventListener('change', (e) => this.handleFileLoad(e));

        // Code preview toggle
        $('#btn_preview').addEventListener('click', () => {
            // Reset to arduino language
            $$('.lang-btn').forEach(b => b.classList.remove('active'));
            $('.lang-btn[data-lang="arduino"]').classList.add('active');
            localStorage.prog = 'arduino';
            this.renderCodePreview();

            const toggle = $('#toggle');
            toggle.style.display = toggle.style.display === 'none' ? 'flex' : 'none';
        });

        // Lang toggle buttons in preview
        $$('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                localStorage.prog = btn.dataset.lang;
                this.renderCodePreview();
            });
        });

        // Preview save/copy
        const btnSaveIno = $('#btn_saveino');
        if (btnSaveIno) {
            btnSaveIno.addEventListener('click', () => {
                this.saveFile(localStorage.prog === 'arduino' ? 'ino' : 'py');
            });
        }
        const btnCopy = $('#btn_copy');
        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                const code = $('#pre_previewArduino')?.textContent || '';
                navigator.clipboard.writeText(code);
            });
        }

        // Block/Code toggle
        $('#codeORblock').addEventListener('click', () => this.toggleBlockCode());

        // Board change
        $('#boards').addEventListener('change', (e) => this.changeCard(e));

        // Search
        $('#btn_search').addEventListener('click', () => this.editor.execCommand('find'));

        // Examples
        $('#btn_example').addEventListener('click', () => {
            this.buildExamples();
            Modal.show('exampleModal');
        });

        // Tooltip hover
        const survol = $('#survol');
        if (survol) {
            const hoverMap = { btn_verify: 'Check code', btn_flash: 'Upload code' };
            for (const [id, text] of Object.entries(hoverMap)) {
                const el = $(`#${id}`);
                if (el) {
                    el.addEventListener('mouseover', () => survol.textContent = text);
                    el.addEventListener('mouseout', () => survol.textContent = '');
                }
            }
        }

        // Port select
        const portSelect = $('#portserie');
        if (portSelect) {
            portSelect.addEventListener('change', () => {
                portSelect.blur();
                localStorage.com = portSelect.value;
            });
        }
    }
};

// Also make accessible globally for Blockly callbacks
window.BlocklyDuino = App;

// Make the Blockly Variables flyout work (requires global namespace)
if (typeof Blockly !== 'undefined') {
    Blockly.Variables.flyoutCategory = function (workspace) {
        var variableModelList = [];
        if (workspace.getAllVariables) {
            variableModelList = workspace.getAllVariables();
        } else if (workspace.variableList) {
            variableModelList = workspace.variableList.slice();
        }

        variableModelList.sort(function (a, b) {
            var nameA = typeof a === 'string' ? a : a.name;
            var nameB = typeof b === 'string' ? b : b.name;
            return String(nameA).toLowerCase().localeCompare(String(nameB).toLowerCase());
        });

        var xmlList = [];
        var button = Blockly.utils.xml.createElement('button');
        button.setAttribute('text', Blockly.Msg.NEW_VARIABLE);
        button.setAttribute('callbackKey', 'CREATE_VARIABLE');
        var targetWb = workspace.targetWorkspace || workspace;
        targetWb.registerButtonCallback('CREATE_VARIABLE', function (b) {
            Blockly.Variables.createVariable(b.getTargetWorkspace ? b.getTargetWorkspace() : targetWb);
        });
        xmlList.push(button);

        if (variableModelList.length > 0) {
            var blockTypes = localStorage.prog !== 'python'
                ? ['variables_set_init', 'variables_set', 'math_change', 'variables_const', 'base_define_const']
                : ['variables_set', 'math_change'];

            blockTypes.forEach(function (type) {
                if (Blockly.Blocks[type]) {
                    var block = Blockly.utils.xml.createElement('block');
                    block.setAttribute('type', type);
                    block.setAttribute('gap', type === 'base_define_const' && Blockly.Blocks['variables_get'] ? "16" : "8");

                    if (Blockly.Variables.generateVariableFieldDom && typeof variableModelList[0] !== 'string') {
                        block.appendChild(Blockly.Variables.generateVariableFieldDom(variableModelList[0]));
                    } else {
                        var field = Blockly.utils.xml.createElement('field');
                        field.setAttribute('name', 'VAR');
                        field.textContent = typeof variableModelList[0] === 'string' ? variableModelList[0] : variableModelList[0].name;
                        block.appendChild(field);
                    }

                    xmlList.push(block);
                }
            });

            for (var i = 0; i < variableModelList.length; i++) {
                if (Blockly.Blocks['variables_get']) {
                    var block = Blockly.utils.xml.createElement('block');
                    block.setAttribute('type', 'variables_get');
                    block.setAttribute('gap', "8");

                    if (Blockly.Variables.generateVariableFieldDom && typeof variableModelList[i] !== 'string') {
                        block.appendChild(Blockly.Variables.generateVariableFieldDom(variableModelList[i]));
                    } else {
                        var field = Blockly.utils.xml.createElement('field');
                        field.setAttribute('name', 'VAR');
                        field.textContent = typeof variableModelList[i] === 'string' ? variableModelList[i] : variableModelList[i].name;
                        block.appendChild(field);
                    }

                    xmlList.push(block);
                }
            }
        }
        return xmlList;
    };
}
