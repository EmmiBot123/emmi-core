/**
 * AI Chat Module — ES module port
 * Same OpenAI-compatible API support, no jQuery.
 */

import { Modal } from './modal.js';

export const AIChat = (() => {
    let chatHistory = [];
    let isProcessing = false;
    let generatedBlocks = [];

    function getBlocksSchema() {
        if (!window.toolboxXmlDOM) return '';
        let schemaList = [];
        let uniqueBlocks = new Set();

        // Add Common Blockly blocks that might not be in the toolbox XML (e.g. dynamic categories)
        schemaList.push(`[Common Blocks]\nvariables_get(field:VAR), variables_set(field:VAR, value:VALUE), math_number(field:NUM), text(field:TEXT), logic_boolean(field:BOOL)`);

        const categories = window.toolboxXmlDOM.querySelectorAll('category');
        categories.forEach(cat => {
            const catName = cat.getAttribute('id') || cat.getAttribute('name') || 'Misc';
            let catBlocks = [];
            cat.querySelectorAll('block').forEach(block => {
                const type = block.getAttribute('type');
                if (!type || uniqueBlocks.has(type)) return;
                uniqueBlocks.add(type);

                let inputs = [];
                block.querySelectorAll('field').forEach(f => {
                    const val = f.textContent.trim();
                    if (val) inputs.push(`field:${f.getAttribute('name')} [example: "${val}"]`);
                    else inputs.push(`field:${f.getAttribute('name')}`);
                });
                block.querySelectorAll('value').forEach(v => inputs.push(`value:${v.getAttribute('name')}`));
                block.querySelectorAll('statement').forEach(s => inputs.push(`statement:${s.getAttribute('name')}`));

                if (inputs.length > 0) catBlocks.push(`${type}(${inputs.join(', ')})`);
                else catBlocks.push(type);
            });
            if (catBlocks.length > 0) schemaList.push(`[${catName}]\n` + catBlocks.join(', '));
        });
        return '\n\n### BLOCK SPECIFICATION (USE THESE TYPES) ###\n' + schemaList.join('\n\n');
    }

    function getBoardConstants() {
        const sel = document.getElementById('boards');
        const boardId = sel ? sel.value : null;
        if (!boardId || !window.profile || !window.profile[boardId]) return '';

        const p = window.profile[boardId];
        let info = `\n\n### CRITICAL: BOARD PINOUT & ALLOWED LABELS ###\n`;
        info += `Active Board: ${p.description || boardId}\n`;

        if (p.dropdownAllPins) {
            const pins = p.dropdownAllPins.map(pair => `"${pair[0]}"`).join(', ');
            info += `YOU MUST USE THESE EXACT LABELS FOR PINS: ${pins}\n`;
        }

        info += "\nINSTRUCTION: Always check the user's request for specific colors or labels (like 'Red', 'Blue', 'MOTOR1'). DO NOT use 'Green' if the user asks for 'Red'. Swap the value in the PIN field to match the user's requirement exactly as per the labels above.\n";

        return info;
    }

    function getSystemPrompt() {
        const sel = document.getElementById('boards');
        const boardName = sel ? sel.options[sel.selectedIndex].text : 'Arduino';
        const boardId = sel ? sel.value : 'uno';
        const mode = document.getElementById('ai-chat-mode')?.value || 'code';

        let p = '';
        if (mode === 'chat') {
            p = `You are an expert Arduino programming assistant. The user is working with a ${boardName} (ID: ${boardId}). Please answer their questions conversationally and helpfully, providing Arduino C++ code and explanations. NEVER generate Blockly XML (\`\`\`xml). Use standard markdown to format your explanations and \`\`\`cpp blocks for Arduino code.`;
        } else if (mode === 'blocks') {
            p = `You are an expert Arduino logic programmer. The user needs Blockly XML blocks for a ${boardName} (ID: ${boardId}). Generate complete working Blockly XML representations of the logic requested. Output ONLY raw Blockly XML code wrapped in \`\`\`xml code blocks. Keep all other explanations extremely concise.\n`;
            p += "CRITICAL: EVERY `<block>` MUST HAVE A `type` ATTRIBUTE. NEVER USE `name` OR OTHER ATTRIBUTES FOR THE BLOCK TYPE NAME.\n";
            p += "CRITICAL: You MUST use the exact block types supported by this IDE. Do NOT invent block names. Use the attached schema.\n";
            p += "CRITICAL: NEVER generate orphan logic blocks (like `if`, `while`, or `delay`) floating outside a container. ALL execution logic MUST be vertically nested inside the `<block type=\"base_setup_loop\">` using `<statement name=\"DO\">` (for Setup) or `<statement name=\"LOOP\">` (for the main Loop).\n";
            p += "- For Setup/Loop: ALWAYS use ONE `<block type=\"base_setup_loop\">` which contains `<statement name=\"DO\">` for Setup and `<statement name=\"LOOP\">` for Loop.\n";
            p += "- For loops: use `controls_repeat` (field `TIMES`), `controls_whileUntil` (field `MODE` as `WHILE` or `UNTIL`, value `BOOL`), or `controls_for` (field `VAR`, values `FROM`, `TO`, `BY`).\n";
            p += "- For Variables: use `variables_set` (field `VAR`, value `VALUE`) and `variables_get` (field `VAR`). ALWAYS use `VAR` for the field name.\n";
            p += "- For Digital IO: use `inout_digital_write` for write, which takes a pin field `PIN` (e.g. `<field name=\"PIN\">13</field>`), and a `STAT` value containing an `inout_onoff` block with a `BOOL` field (e.g. `<value name=\"STAT\"><block type=\"inout_onoff\"><field name=\"BOOL\">HIGH</field></block></value>`). For read use `inout_digital_read` with a `PIN` field and `pullup` field (`TRUE` or `FALSE`).\n";
            p += "- For Analog IO: use `inout_analog_write` (pin field `broche`, value `NUM`) and `inout_analog_read` (pin field `broche`).\n";
            p += "- For I2C LCD: use `lcdi2c_setup` (field `NAME` e.g. \"0x27\", values `COLUMNS` and `ROWS` with `math_number`), `lcdi2c_clear`, and `lcdi2c_setcursor` (values `column`, `row` with `math_number`, and `texttoprint` with a `text` block having a `TEXT` field).\n";
            p += "- For time: use `base_delay` with a `<field name=\"unite\">` (`m` for milliseconds, `s` for seconds) and a `<value name=\"DELAY_TIME\">` containing a `<block type=\"math_number\">`.\n";
            p += "- Never use `controls_loop`, `digital_write`, or `delay`.\n";
        } else {
            p = `You are an expert Arduino programmer. The user is working with a ${boardName} (ID: ${boardId}). Provide complete, working Arduino sketches. Include necessary #include statements. Format code in \`\`\`cpp code blocks. If ESP32/ESP8266, use appropriate libraries. Keep explanations concise.`;
        }

        return p + getBoardConstants() + getBlocksSchema();
    }

    function loadSettings() {
        return {
            provider: localStorage.getItem('ai_api_provider') || 'openrouter',
            endpoint: localStorage.getItem('ai_api_endpoint') || 'https://openrouter.ai/api/v1/chat/completions',
            apiKey: localStorage.getItem('ai_api_key') || '',
            model: localStorage.getItem('ai_model') || 'openai/gpt-4o'
        };
    }

    function saveSettings(provider, endpoint, apiKey, model) {
        localStorage.setItem('ai_api_provider', provider);
        localStorage.setItem('ai_api_endpoint', endpoint);
        localStorage.setItem('ai_api_key', apiKey);
        localStorage.setItem('ai_model', model);
    }

    function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

    function addUserMessage(text) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;
        const div = document.createElement('div');
        div.className = 'ai-message ai-user';
        div.innerHTML = `<div class="ai-bubble">${escapeHtml(text)}</div><div class="ai-avatar"><i class="fa fa-user"></i></div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function addBotMessage(text) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return null;
        const div = document.createElement('div');
        div.className = 'ai-message ai-bot';
        div.innerHTML = `<div class="ai-avatar"><i class="fa fa-robot"></i></div><div class="ai-bubble">${formatMessage(text)}</div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div;
    }

    function formatMessage(text) {
        // Protect newlines inside code blocks by extracting them first
        const blocks = [];
        let f = text.replace(/```(?:xml|cpp|c\+\+|arduino|c|ino)?\n?([\s\S]*?)```/gi, (match, code, offset, fullString) => {
            const hasXml = code.trim().startsWith('<xml') || code.trim().startsWith('<block');
            const isCpp = match.toLowerCase().startsWith('```cpp') || match.toLowerCase().startsWith('```arduino') || match.toLowerCase().startsWith('```c');
            const type = hasXml ? 'xml' : (isCpp ? 'cpp' : 'generic');
            const id = 'cb-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);

            let replacement = '';
            const mode = document.getElementById('ai-chat-mode')?.value || 'code';

            if (type === 'xml' && mode !== 'chat') {
                // Hide XML blocks explicitly and show a success banner only if not in chat mode
                replacement = `<div class="ai-code-block" style="display: none;"><div class="ai-code-header"><span>Blockly XML</span><button class="ai-insert-btn" data-code-id="${id}" data-type="xml" data-raw-code="${encodeURIComponent(code.trim())}" title="Insert Blocks"><i class="fa fa-arrow-right"></i> Insert</button></div><pre id="${id}"><code>${escapeHtml(code.trim())}</code></pre></div><div class="ai-success-msg" style="color: #4CAF50; padding: 10px; background: rgba(76, 175, 80, 0.1); border-radius: 5px; margin: 10px 0; border: 1px solid rgba(76, 175, 80, 0.2);"><i class="fa fa-check-circle"></i> Blocks generated and added to workspace!</div>`;
            } else if (type === 'cpp' && mode !== 'chat') {
                replacement = `<div class="ai-code-block"><div class="ai-code-header"><span>Arduino Code</span><button class="ai-insert-btn" data-code-id="${id}" data-type="cpp" data-raw-code="${encodeURIComponent(code.trim())}" title="Insert into editor"><i class="fa fa-arrow-right"></i> Insert</button></div><pre id="${id}"><code>${escapeHtml(code.trim())}</code></pre></div>`;
            } else {
                // In chat mode, or generic snippet, just display it normally without auto-insert styling/banners
                replacement = `<pre class="ai-code-generic"><code>${escapeHtml(code.trim())}</code></pre>`;
            }
            blocks.push(replacement);
            return `%%%BLOCK_${blocks.length - 1}%%%`;
        });

        // Now safely format standard text
        f = f.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');
        f = f.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        f = f.replace(/\n/g, '<br>'); // Converts text newlines to HTML breaks safely

        // Restore blocks
        f = f.replace(/%%%BLOCK_(\d+)%%%/g, (_, index) => {
            return blocks[parseInt(index, 10)];
        });
        return f;
    }

    function insertCode(btn) {
        if (!btn) return;
        const type = btn.dataset.type;
        const rawCode = btn.dataset.rawCode;

        let code = '';
        if (rawCode) {
            code = decodeURIComponent(rawCode);
        } else {
            const blockId = btn.dataset.codeId;
            const block = document.getElementById(blockId);
            if (!block) return;
            code = block.textContent;
        }

        if (type === 'xml') {
            // Switch to blocks mode if in code
            if (localStorage.content === 'off' && window.BlocklyDuino) {
                window.BlocklyDuino.showBlocks();
            }
            try {
                let xmlString = code.trim();

                // FIX: AI often uses 'name' instead of 'type' for the block type in generated XML
                // This targets specifically <block ... name="something"> where 'type' is missing.
                xmlString = xmlString.replace(/<block([^>]+)name="([^"]+)"/g, (match, attrs, nameVal) => {
                    if (attrs.indexOf('type=') === -1) {
                        return `<block${attrs}type="${nameVal}"`;
                    }
                    return match;
                });

                // Check if the user returned just a single block instead of full xml
                if (!xmlString.includes('<xml')) {
                    xmlString = '<xml xmlns="https://developers.google.com/blockly/xml">' + xmlString + '</xml>';
                }
                const dom = Blockly.Xml.textToDom(xmlString);
                const workspace = Blockly.getMainWorkspace();
                Blockly.Xml.appendDomToWorkspace(dom, workspace);

                // Add to generated blocks for the toolbox
                for (let i = 0; i < dom.children.length; i++) {
                    generatedBlocks.push(dom.children[i].cloneNode(true));
                }

                if (window.BlocklyDuino && window.BlocklyDuino.refreshToolboxLevel) {
                    window.BlocklyDuino.refreshToolboxLevel();
                }
            } catch (err) {
                console.error("XML parse error", err);
                console.log("Failed XML:", code);
                alert("Could not insert blocks: Invalid XML from AI. Error: " + err.message);
                return;
            }
        } else {
            // Switch to code mode if in blocks
            if (localStorage.content === 'on' && window.BlocklyDuino) {
                window.BlocklyDuino.showCodeEditor();
            }

            if (window.editor) {
                window.editor.setValue(code, 1);
                window.editor.session.setMode('ace/mode/c_cpp');
            }
        }

        // Visual feedback
        const oldHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa fa-check"></i> Inserted!';
        btn.classList.add('inserted');
        setTimeout(() => { btn.innerHTML = oldHtml; btn.classList.remove('inserted'); }, 2000);
    }

    function showTyping() {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return '';
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'ai-message ai-bot ai-typing';
        div.innerHTML = '<div class="ai-avatar"><i class="fa fa-robot"></i></div><div class="ai-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return id;
    }

    function removeTyping(id) { document.getElementById(id)?.remove(); }

    function syncWithClipboard() {
        navigator.clipboard.readText().then(text => {
            if (!text || !text.trim()) {
                alert("Clipboard is empty or could not be read.");
                return;
            }

            const mode = document.getElementById('ai-chat-mode')?.value || 'code';
            let processedText = text.trim();

            // If the user pasted raw XML or Code without backticks, wrap it so formatMessage handles it
            if (!processedText.includes('```')) {
                if (processedText.startsWith('<xml') || processedText.startsWith('<block')) {
                    processedText = "```xml\n" + processedText + "\n```";
                } else if (mode === 'code') {
                    // Guessing it's code if it contains keywords or common Arduino structure
                    if (processedText.includes('void') || processedText.includes('#') || processedText.length > 20) {
                        processedText = "```cpp\n" + processedText + "\n```";
                    }
                }
            }

            addBotMessage("📋 Content received from clipboard. Syncing...");
            const msgDiv = addBotMessage(processedText);

            if (msgDiv) {
                // Give a tiny delay for DOM to render the buttons
                setTimeout(() => {
                    const btns = msgDiv.querySelectorAll('.ai-insert-btn');
                    if (btns.length > 0) {
                        // Click the most relevant button
                        let buttonToClick = btns[0];
                        btns.forEach(btn => {
                            if ((mode === 'blocks' && btn.dataset.type === 'xml') ||
                                (mode === 'code' && btn.dataset.type === 'cpp')) {
                                buttonToClick = btn;
                            }
                        });
                        insertCode(buttonToClick);
                    } else {
                        // Fallback: If no button was generated, it might be raw text the user wants to treat as code
                        addBotMessage("⚠️ No code blocks detected. If you pasted raw code, try wrapping it in \\`\\`\\` or use In-App AI.");
                    }
                }, 100);
            }
        }).catch(err => {
            console.error('Clipboard error:', err);
            alert("Clipboard access denied. Please allow it in browser settings (click the lock icon in address bar).");
        });
    }

    function handleExternalLLM(text) {
        const provider = document.getElementById('ai-chat-provider')?.value;
        if (!provider || provider === 'local') return false;

        const systemPrompt = getSystemPrompt();
        const fullPrompt = "### SYSTEM INSTRUCTIONS ###\n" + systemPrompt + "\n\n### USER REQUEST ###\n" + text;

        // Copy to clipboard first because URLs have length limits that cause 400/431 errors
        navigator.clipboard.writeText(fullPrompt).then(() => {
            let url = "";
            if (provider === 'chatgpt') url = "https://chatgpt.com/";
            else if (provider === 'gemini') url = "https://gemini.google.com/app";
            else if (provider === 'claude') url = "https://claude.ai/chat";
            else if (provider === 'grok') url = "https://x.com/i/grok";
            else return;

            window.open(url, '_blank');
            addUserMessage(text);
            addBotMessage(`📋 **Prompt copied to clipboard!**\n\n🚀 Opening **${provider.toUpperCase()}**...\n\n1. **Paste (Ctrl+V)** the prompt into the AI chat window.\n2. Once you get the response, **Copy** it.\n3. Return here and click the **📋 Clipboard** icon in the header.`);
        }).catch(err => {
            console.error('Clipboard write error:', err);
            alert("Could not copy prompt automatically. Please manually copy your request.");
        });

        return true;
    }

    async function sendMessage(text) {
        if (isProcessing || !text.trim()) return;

        // Check if we should use external provider
        if (handleExternalLLM(text.trim())) return;

        const settings = loadSettings();
        if (!settings.apiKey) { addBotMessage('⚠️ Configure your API key first. Click ⚙️ settings.'); return; }

        isProcessing = true;
        addUserMessage(text);
        chatHistory.push({ role: 'user', content: text });
        const typingId = showTyping();

        try {
            const systemPrompt = getSystemPrompt();
            let url = settings.endpoint;
            let headers = { 'Content-Type': 'application/json' };
            let body = {};

            if (settings.provider === 'google') {
                url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`;
                // Convert history to Gemini format
                const contents = chatHistory.slice(-10).map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }));

                body = {
                    contents: contents,
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048
                    }
                };
            } else {
                // OpenAI / OpenRouter / Custom format
                // For OpenRouter, we use the saved endpoint if it's default, 
                // but for Custom, we always use the user-defined endpoint.
                if (settings.provider === 'openrouter') {
                    url = 'https://openrouter.ai/api/v1/chat/completions';
                } else {
                    url = settings.endpoint;
                }

                if (settings.apiKey) {
                    headers['Authorization'] = 'Bearer ' + settings.apiKey;
                }

                const messages = [{ role: 'system', content: systemPrompt }, ...chatHistory.slice(-10)];
                body = {
                    model: settings.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 2048
                };
            }

            const r = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            removeTyping(typingId);
            if (!r.ok) {
                const errText = await r.text();
                addBotMessage('❌ API Error (' + r.status + '): ' + errText);
                isProcessing = false;
                return;
            }

            const data = await r.json();
            let response = '';

            if (settings.provider === 'google') {
                response = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
            } else {
                response = data.choices?.[0]?.message?.content || 'No response.';
            }

            chatHistory.push({ role: 'assistant', content: response });
            const msgDiv = addBotMessage(response);

            // Auto-insert generated blocks/code
            if (msgDiv) {
                setTimeout(() => {
                    const mode = document.getElementById('ai-chat-mode')?.value || 'code';
                    if (mode !== 'chat') {
                        const btns = msgDiv.querySelectorAll('.ai-insert-btn');
                        btns.forEach(btn => {
                            if ((mode === 'blocks' && btn.dataset.type === 'xml') ||
                                (mode === 'code' && btn.dataset.type === 'cpp')) {
                                insertCode(btn);
                            }
                        });
                    }
                }, 50);
            }
        } catch (err) {
            removeTyping(typingId);
            addBotMessage('❌ Error: ' + err.message);
        }
        isProcessing = false;
    }

    function init() {
        document.getElementById('btn_ai_chat')?.addEventListener('click', () => {
            const panel = document.getElementById('ai-chat-panel');
            if (panel) {
                panel.classList.toggle('open');
                // Auto-sync dropdown with current view
                const modeSelect = document.getElementById('ai-chat-mode');
                if (modeSelect && panel.classList.contains('open') && modeSelect.value !== 'chat') {
                    modeSelect.value = localStorage.content === 'off' ? 'code' : 'blocks';
                }
            }
        });
        document.getElementById('btn_ai_close')?.addEventListener('click', () => {
            document.getElementById('ai-chat-panel')?.classList.remove('open');
        });
        document.getElementById('btn_ai_send')?.addEventListener('click', () => {
            const input = document.getElementById('ai-chat-input');
            if (input?.value.trim()) { sendMessage(input.value.trim()); input.value = ''; }
        });
        document.getElementById('btn_ai_sync_clipboard')?.addEventListener('click', () => {
            syncWithClipboard();
        });
        document.getElementById('ai-chat-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('btn_ai_send')?.click(); }
        });
        const OP_MODELS = {
            'openai': ['openai/gpt-4o', 'openai/gpt-4o-mini', 'openai/chatgpt-4o-latest', 'openai/gpt-4-turbo', 'openai/gpt-3.5-turbo'],
            'google': ['google/gemini-2.0-flash', 'google/gemini-1.5-pro', 'google/gemini-1.5-flash'],
            'anthropic': ['anthropic/claude-3.7-sonnet', 'anthropic/claude-3.5-sonnet', 'anthropic/claude-3-opus'],
            'meta': ['meta-llama/llama-3.3-70b-instruct', 'meta-llama/llama-3.1-405b-instruct', 'meta-llama/llama-3.1-70b-instruct'],
            'custom': []
        };

        const GOOGLE_MODELS = [
            'gemini-2.0-flash',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-1.0-pro'
        ];

        function updateModelDropdown(company, selectedModel) {
            const dropdown = document.getElementById('ai-model-dropdown');
            const customInput = document.getElementById('ai-model-name');
            const provider = document.getElementById('ai-api-provider')?.value || 'openrouter';
            if (!dropdown || !customInput) return;
            dropdown.innerHTML = '';

            if (provider === 'google') {
                dropdown.style.display = 'block';
                GOOGLE_MODELS.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    dropdown.appendChild(opt);
                });
                const otherOpt = document.createElement('option');
                otherOpt.value = 'other';
                otherOpt.textContent = 'Other (type manually)...';
                dropdown.appendChild(otherOpt);

                if (selectedModel && GOOGLE_MODELS.includes(selectedModel)) {
                    dropdown.value = selectedModel;
                    customInput.style.display = 'none';
                } else if (selectedModel) {
                    dropdown.value = 'other';
                    customInput.value = selectedModel;
                    customInput.style.display = 'block';
                } else {
                    customInput.style.display = 'none';
                }

                // Add change listener to dropdown for Google specifically
                dropdown.onchange = () => {
                    customInput.style.display = dropdown.value === 'other' ? 'block' : 'none';
                };
            } else if (provider === 'custom') {
                dropdown.style.display = 'none';
                customInput.style.display = 'block';
            } else if (company === 'custom') {
                dropdown.style.display = 'none';
                customInput.style.display = 'block';
            } else {
                dropdown.style.display = 'block';
                customInput.style.display = 'none';
                OP_MODELS[company].forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    dropdown.appendChild(opt);
                });
                if (selectedModel && OP_MODELS[company].includes(selectedModel)) {
                    dropdown.value = selectedModel;
                }
            }
        }

        document.getElementById('ai-api-provider')?.addEventListener('change', (e) => {
            const provider = e.target.value;
            const endpointGroup = document.getElementById('ai-endpoint-group');
            const companyGroup = document.getElementById('ai-model-company')?.parentElement;
            const keyLabel = document.getElementById('ai-key-label');

            if (provider === 'google') {
                if (endpointGroup) endpointGroup.style.display = 'none';
                if (companyGroup) companyGroup.style.display = 'none';
                if (keyLabel) keyLabel.textContent = 'Gemini API Key';
                updateModelDropdown();
            } else if (provider === 'custom') {
                if (endpointGroup) endpointGroup.style.display = 'block';
                if (companyGroup) companyGroup.style.display = 'none';
                if (keyLabel) keyLabel.textContent = 'API Key';
                updateModelDropdown();
            } else {
                if (endpointGroup) endpointGroup.style.display = 'none';
                if (companyGroup) companyGroup.style.display = 'block';
                if (keyLabel) keyLabel.textContent = 'OpenRouter API Key';
                updateModelDropdown(document.getElementById('ai-model-company')?.value);
            }
        });

        document.getElementById('btn_ai_settings')?.addEventListener('click', () => {
            const s = loadSettings();

            if (document.getElementById('ai-api-provider')) document.getElementById('ai-api-provider').value = s.provider;
            if (document.getElementById('ai-api-endpoint')) document.getElementById('ai-api-endpoint').value = s.endpoint;
            if (document.getElementById('ai-api-key')) document.getElementById('ai-api-key').value = s.apiKey;

            const endpointGroup = document.getElementById('ai-endpoint-group');
            const companyGroup = document.getElementById('ai-model-company')?.parentElement;
            const keyLabel = document.getElementById('ai-key-label');
            let company = 'custom';

            if (s.provider === 'google') {
                if (endpointGroup) endpointGroup.style.display = 'none';
                if (companyGroup) companyGroup.style.display = 'none';
                if (keyLabel) keyLabel.textContent = 'Gemini API Key';
            } else if (s.provider === 'custom') {
                if (endpointGroup) endpointGroup.style.display = 'block';
                if (companyGroup) companyGroup.style.display = 'none';
                if (keyLabel) keyLabel.textContent = 'API Key';
            } else {
                if (endpointGroup) endpointGroup.style.display = 'none';
                if (companyGroup) companyGroup.style.display = 'block';
                if (keyLabel) keyLabel.textContent = 'OpenRouter API Key';
                for (const [comp, models] of Object.entries(OP_MODELS)) {
                    if (models.includes(s.model)) {
                        company = comp;
                        break;
                    }
                }
                if (!s.model.includes('/')) company = 'openai'; // fallback
            }

            if (document.getElementById('ai-model-company')) document.getElementById('ai-model-company').value = company;
            if (document.getElementById('ai-model-name')) document.getElementById('ai-model-name').value = s.model;
            updateModelDropdown(company, s.model);

            Modal.show('aiSettingsModal');
        });
        document.getElementById('btn_ai_save_settings')?.addEventListener('click', () => {
            const provider = document.getElementById('ai-api-provider')?.value;
            const company = document.getElementById('ai-model-company')?.value;
            const dropdown = document.getElementById('ai-model-dropdown');
            const customModel = document.getElementById('ai-model-name').value;

            let modelVal = '';
            if (provider === 'google') {
                modelVal = (dropdown.value === 'other') ? customModel : dropdown.value;
            } else if (provider === 'custom') {
                modelVal = customModel;
            } else {
                modelVal = (company === 'custom') ? customModel : dropdown.value;
            }

            saveSettings(
                provider,
                document.getElementById('ai-api-endpoint').value,
                document.getElementById('ai-api-key').value,
                modelVal
            );
            Modal.hide('aiSettingsModal');
        });

        // Delegate insert button clicks
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.ai-insert-btn');
            if (btn) insertCode(btn);
        });
    }

    function getGeneratedBlocks() {
        return generatedBlocks;
    }

    return { sendMessage, insertCode, init, getGeneratedBlocks };
})();

// Make AIChat available globally for onclick handlers
window.AIChat = AIChat;
