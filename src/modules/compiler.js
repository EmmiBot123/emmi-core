/**
 * Compiler Bridge — ES module port
 * Communicates with local arduino-cli companion server.
 */

import { Modal } from './modal.js';

export const CompilerBridge = (() => {
    const SERVER_URL = 'http://localhost:3456';
    let serverOnline = false;

    const BOARD_FQBN_MAP = {
        'uno': 'arduino:avr:uno', 'nano': 'arduino:avr:nano:cpu=atmega328old',
        'nanooptiboot': 'arduino:avr:nano', 'nona4809': 'arduino:megaavr:nona4809',
        'mega': 'arduino:avr:mega:cpu=atmega2560', 'leonardo': 'arduino:avr:leonardo',
        'micro': 'arduino:avr:micro', 'mini': 'arduino:avr:mini',
        'mkrwifi1010': 'arduino:samd:mkrwifi1010', 'uno_bt': 'arduino:avr:bt',
        'pro8': 'arduino:avr:pro:cpu=8MHzatmega328', 'yun': 'arduino:avr:yun',
        'OttoESP': 'esp8266:esp8266:nodemcuv2', 'wemosD1miniPro': 'esp8266:esp8266:d1_mini',
        'Ottoky': 'esp32:esp32:esp32',
        'MRTnode': 'esp32:esp32:esp32', 'MRTnodev1': 'esp32:esp32:esp32',
        'MRTnodesensor': 'esp32:esp32:esp32', 'MRTnodeflipper': 'esp32:esp32:esp32',
        'mrtduino': 'arduino:avr:nano'
    };

    function getBoardFQBN() {
        const sel = document.getElementById('boards');
        return BOARD_FQBN_MAP[sel?.value || 'uno'] || 'arduino:avr:uno';
    }

    async function checkServer() {
        try {
            const r = await fetch(SERVER_URL + '/health', { signal: AbortSignal.timeout(3000) });
            serverOnline = r.ok;
        } catch { serverOnline = false; }
        updateStatus(serverOnline);
        return serverOnline;
    }

    function updateStatus(online) {
        const el = document.getElementById('server-status');
        if (el) {
            const onlineText = (window.MSG && window.MSG.server_online) ? window.MSG.server_online : '⬤ Online';
            const offlineText = (window.MSG && window.MSG.server_offline) ? window.MSG.server_offline : '⬤ Offline';
            el.innerHTML = online ? onlineText : offlineText;
            el.className = 'server-status ' + (online ? 'online' : 'offline');
        }
    }

    function getCode() {
        if (localStorage.content === 'off' && window.editor) return window.editor.getValue();
        if (typeof Blockly !== 'undefined' && window.BlocklyDuino?.workspace)
            return Blockly.Arduino.workspaceToCode(window.BlocklyDuino.workspace);
        return '';
    }

    function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

    function showMessage(text, type) {
        const div = document.getElementById('messageDIV');
        if (div) {
            const colorMap = { success: '#2ecc71', error: '#e74c3c', warning: '#f39c12', info: '#3498db' };
            div.innerHTML = `<pre style="color:${colorMap[type] || '#333'};white-space:pre-wrap;max-height:400px;overflow-y:auto;">${escapeHtml(text)}</pre>`;
            Modal.show('messageModal');
        }
    }

    async function runStreamAction(url, body) {
        const title = document.getElementById('progressTitle');
        const progressBar = document.getElementById('compilation-progress');
        const statusText = document.getElementById('progress-status-text');
        const errorMsg = document.getElementById('progress-error-msg');
        const closeBtn = document.getElementById('btn_close_progress');

        if (title) title.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';
        if (progressBar) progressBar.style.width = '5%';
        if (statusText) statusText.textContent = 'Preparing...';
        if (errorMsg) { errorMsg.textContent = ''; errorMsg.style.display = 'none'; }
        if (closeBtn) closeBtn.style.display = 'none';

        Modal.show('progressModal');

        // Smooth progress simulation
        let currentPercent = 5;
        const progressInterval = setInterval(() => {
            if (currentPercent < 90) {
                currentPercent += (90 - currentPercent) * 0.05;
                if (progressBar) progressBar.style.width = currentPercent + '%';
            }
        }, 800);

        try {
            const response = await fetch(SERVER_URL + url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('HTTP error ' + response.status);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullLog = '';
            let exitCode = -1;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                // Handle JSON fallback if bridge is old/restarts
                if (chunk.trim().startsWith('{') && chunk.includes('"success"')) {
                    try {
                        const data = JSON.parse(chunk);
                        fullLog = data.output || data.error || chunk;
                        exitCode = data.success ? 0 : 1;
                        break;
                    } catch (e) { }
                }

                fullLog += chunk;

                // Update status text based on keywords
                if (chunk.includes('Compiling')) statusText.textContent = 'Compiling sketch...';
                else if (chunk.includes('Linking')) statusText.textContent = 'Linking binaries...';
                else if (chunk.includes('Writing') || chunk.includes('Reading')) statusText.textContent = 'Uploading to board...';

                if (chunk.includes('EMMI_EXIT:')) {
                    const parts = chunk.split('EMMI_EXIT:');
                    exitCode = parseInt(parts[1]);
                }
            }

            clearInterval(progressInterval);
            const success = exitCode === 0;
            if (progressBar) progressBar.style.width = '100%';
            if (statusText) statusText.textContent = success ? 'Finished Successfully!' : 'Failed.';
            if (title) title.innerHTML = success ? '<i class="fa fa-circle-check" style="color:#2ecc71"></i> Done' : '<i class="fa fa-circle-xmark" style="color:#e74c3c"></i> Error';

            if (!success && errorMsg) {
                errorMsg.textContent = fullLog.replace(/EMMI_EXIT:\d+/, '').trim();
                errorMsg.style.display = 'block';
            }

            if (closeBtn) closeBtn.style.display = 'inline-block';

            return { success };

        } catch (err) {
            clearInterval(progressInterval);
            if (statusText) statusText.textContent = 'Connection Error.';
            if (errorMsg) {
                errorMsg.textContent = 'Error: ' + err.message;
                errorMsg.style.display = 'block';
            }
            if (closeBtn) closeBtn.style.display = 'inline-block';
            return { success: false, error: err.message };
        }
    }

    async function compile(code, board) {
        if (!serverOnline) { showMessage('Compiler server offline.', 'error'); return null; }
        code = code || getCode(); board = board || getBoardFQBN();
        if (!code.trim()) { showMessage('No code to compile.', 'warning'); return null; }
        return await runStreamAction('/compile', { code, fqbn: board });
    }

    async function upload(code, board, port) {
        if (!serverOnline) { showMessage('Compiler server offline.', 'error'); return null; }

        // Auto-release port from Web Serial if monitor is active
        try {
            const { SerialBridge } = await import('./serial.js');
            if (SerialBridge.isConnected()) {
                console.log('Disconnecting serial monitor for upload...');
                await SerialBridge.disconnect();
            }
        } catch (e) {
            console.warn('Could not auto-disconnect serial:', e);
        }

        code = code || getCode(); board = board || getBoardFQBN();
        port = port || document.getElementById('portserie')?.value || '';
        if (!code.trim()) { showMessage('No code to upload.', 'warning'); return null; }
        if (!port) { showMessage('No serial port selected.', 'warning'); return null; }
        return await runStreamAction('/upload', { code, fqbn: board, port });
    }

    function init() {
        checkServer();
        setInterval(checkServer, 15000);
        document.getElementById('btn_verify')?.addEventListener('click', (e) => { e.preventDefault(); compile(); });
        document.getElementById('btn_flash')?.addEventListener('click', (e) => { e.preventDefault(); upload(); });
    }

    return { checkServer, compile, upload, getBoardFQBN, init, isServerOnline: () => serverOnline };
})();
