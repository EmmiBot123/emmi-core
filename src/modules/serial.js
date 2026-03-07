/**
 * Web Serial API Bridge — ES module port
 */

export const SerialBridge = (() => {
    let port = null, reader = null, readableStreamClosed = null;
    let isConnected = false, keepReading = false;
    let connectTime = 0;
    let onReceiveCallback = null;

    function isSupported() { return 'serial' in navigator; }

    async function requestPort() {
        if (!isSupported()) { alert('Web Serial API not supported. Use Chrome or Edge.'); return null; }
        try { port = await navigator.serial.requestPort(); updatePortDropdown(); return port; }
        catch (err) { if (err.name !== 'NotFoundError') console.error('Port request failed:', err); return null; }
    }

    async function connect(baudRate) {
        if (!port) { await requestPort(); if (!port) return false; }
        try {
            await port.open({ baudRate: parseInt(baudRate || 9600) });
            isConnected = true; keepReading = true;
            connectTime = Date.now();
            readLoop();
            updateUI(true);
            appendOutput('--- Connected at ' + (baudRate || 9600) + ' baud ---\n', 'system');
            return true;
        } catch (err) { console.error('Open failed:', err); appendOutput('Error: ' + err.message + '\n', 'error'); return false; }
    }

    async function readLoop() {
        while (port?.readable && keepReading) {
            const decoder = new TextDecoderStream();
            readableStreamClosed = port.readable.pipeTo(decoder.writable);
            reader = decoder.readable.getReader();
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    if (value) { appendOutput(value, 'received'); onReceiveCallback?.(value); }
                }
            } catch (err) {
                if (keepReading) {
                    let msg = err.message;
                    // Suppress framing errors within the first 1.5s of connection (transient reset noise)
                    const isTransient = (Date.now() - connectTime) < 1500;
                    const isFraming = msg.toLowerCase().includes('framing error');

                    if (isFraming && isTransient) {
                        console.warn('Suppressed transient framing error:', msg);
                    } else {
                        if (isFraming) {
                            msg += ' (Suggestion: Check baud rate or try Reconnecting)';
                        }
                        appendOutput('Read error: ' + msg + '\n', 'error');
                    }
                }
            }
            finally { reader?.releaseLock(); }
        }
    }

    async function send(data) {
        if (!port?.writable || !isConnected) {
            appendOutput('Error: Not connected\n', 'error');
            return;
        }
        try {
            const writer = port.writable.getWriter();
            try {
                const encoder = new TextEncoder();
                const encoded = encoder.encode(data + '\n');
                await writer.write(encoded);
                console.log('Serial Send:', data);
                appendOutput('> ' + data + '\n', 'sent');
            } finally {
                writer.releaseLock();
            }
        } catch (err) {
            appendOutput('Write error: ' + err.message + '\n', 'error');
        }
    }

    async function disconnect() {
        keepReading = false; isConnected = false;
        try { if (reader) { await reader.cancel(); reader = null; } if (readableStreamClosed) await readableStreamClosed.catch(() => { }); if (port) await port.close(); }
        catch (err) { console.error('Disconnect error:', err); }
        updateUI(false);
        appendOutput('--- Disconnected ---\n', 'system');
    }

    function appendOutput(text, type) {
        const out = document.getElementById('serial-output');
        if (!out) return;

        const showTimestamp = document.getElementById('serial-timestamp')?.checked;
        let finalOutput = text;

        if (showTimestamp) {
            const now = new Date();
            const ts = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}] `;

            // If text contains newlines, prefix each line (except if it ends with newline)
            if (text.includes('\n')) {
                finalOutput = text.split('\n').map((line, i, arr) => {
                    if (i === arr.length - 1 && line === '') return '';
                    return ts + line;
                }).join('\n');
            } else {
                finalOutput = ts + text;
            }
        }

        const span = document.createElement('span');
        span.className = 'serial-' + (type || 'received');
        span.textContent = finalOutput;
        out.appendChild(span);
        out.scrollTop = out.scrollHeight;
    }

    function clearOutput() { const out = document.getElementById('serial-output'); if (out) out.innerHTML = ''; }

    function updateUI(connected) {
        const btn = document.getElementById('btn_serial_connect');
        if (!btn) return;
        btn.innerHTML = connected ? '<i class="fa fa-plug-circle-xmark"></i>' : '<i class="fa fa-plug"></i>';
        btn.title = connected ? 'Disconnect' : 'Connect';
        btn.classList.toggle('connected', connected);
    }

    async function updatePortDropdown() {
        const select = document.getElementById('portserie');
        if (!select) return;

        let bridgePorts = [];
        const SERVER_URL = 'http://127.0.0.1:3457';
        const ALT_URL = 'http://localhost:3457';

        try {
            console.log('[EMMI] Serial: Checking bridge at ' + SERVER_URL + '/ports');
            const response = await fetch(SERVER_URL + '/ports', { signal: AbortSignal.timeout(2000) });
            if (response.ok) {
                const data = await response.json();
                bridgePorts = data.map(p => ({
                    name: p.address,
                    desc: p.protocol_label || 'Serial Port'
                }));
                console.log('[EMMI] Serial: Bridge ports loaded via 127.0.0.1');
            }
        } catch (e) {
            console.warn('[EMMI] Serial: 127.0.0.1/ports failed:', e.name, e.message);

            // Try localhost fallback
            try {
                console.log('[EMMI] Serial: Trying fallback to ' + ALT_URL + '/ports');
                const responseAlt = await fetch(ALT_URL + '/ports', { signal: AbortSignal.timeout(2000) });
                if (responseAlt.ok) {
                    const data = await responseAlt.json();
                    bridgePorts = data.map(p => ({
                        name: p.address,
                        desc: p.protocol_label || 'Serial Port'
                    }));
                    console.log('[EMMI] Serial: Bridge ports loaded via localhost');
                }
            } catch (eAlt) {
                console.warn('[EMMI] Serial: localhost/ports failed:', eAlt.name, eAlt.message);
                // ignore bridge errors, will fallback to webPorts
            }
        }

        let webPorts = [];
        if (isSupported()) {
            try {
                const ports = await navigator.serial.getPorts();
                webPorts = ports.map((p, i) => {
                    const info = p.getInfo();
                    return {
                        name: 'WebSerial_' + i,
                        desc: 'Port ' + (i + 1) + (info.usbVendorId ? ' (VID:' + info.usbVendorId.toString(16) + ')' : '')
                    };
                });
            } catch (e) { /* ignore */ }
        }

        let allPorts = [];
        if (bridgePorts.length > 0) {
            allPorts = bridgePorts;
        } else {
            allPorts = webPorts;
        }

        if (allPorts.length === 0 && !isSupported()) {
            if (select.innerHTML !== '<option value="">No ports found</option>') {
                select.innerHTML = '<option value="">No ports found</option>';
            }
            return;
        }

        // Diffing logic: only update if the list has changed
        const currentOptions = Array.from(select.options).map(opt => ({
            name: opt.value,
            text: opt.textContent
        }));

        const newOptions = allPorts.map(p => ({
            name: p.name,
            text: p.name + ' (' + p.desc + ')'
        }));

        const hasChanged = currentOptions.length !== newOptions.length ||
            newOptions.some((opt, i) => opt.name !== currentOptions[i].name || opt.text !== currentOptions[i].text);

        if (hasChanged) {
            const selectedValue = select.value;
            select.innerHTML = '';

            if (allPorts.length === 0) {
                select.innerHTML = '<option value="">No ports found</option>';
            } else {
                allPorts.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.name;
                    opt.textContent = p.name + ' (' + p.desc + ')';
                    select.appendChild(opt);
                });

                // Restore selection if still available
                if (selectedValue) {
                    select.value = selectedValue;
                }
            }
        }
    }

    function init() {
        if (!isSupported()) console.warn('Web Serial API not supported');

        document.getElementById('btn_term')?.addEventListener('click', async () => {
            const panel = document.getElementById('serial-monitor-panel');
            if (panel) {
                const isNowVisible = panel.style.display === 'none';
                panel.style.display = isNowVisible ? 'flex' : 'none';

                if (isNowVisible) {
                    if (!isConnected) updatePortDropdown();
                } else {
                    // Auto-disconnect when monitor is hidden
                    if (isConnected) await disconnect();
                }
            }
        });

        document.getElementById('btn_serial_connect')?.addEventListener('click', async () => {
            if (isConnected) { await disconnect(); } else { await requestPort(); if (port) { const baud = document.getElementById('serial-baudrate'); await connect(baud?.value || 9600); } }
        });

        document.getElementById('btn_serial_send')?.addEventListener('click', () => {
            const input = document.getElementById('serial-input');
            if (input?.value.trim()) { send(input.value); input.value = ''; }
        });

        document.getElementById('serial-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('btn_serial_send')?.click();
        });

        document.getElementById('btn_serial_clear')?.addEventListener('click', clearOutput);
        document.getElementById('btn_serial_close')?.addEventListener('click', async () => {
            const panel = document.getElementById('serial-monitor-panel');
            if (panel) panel.style.display = 'none';
            // Auto-disconnect when close button is clicked
            if (isConnected) await disconnect();
        });

        document.getElementById('portserie')?.addEventListener('dblclick', requestPort);

        // Initial load
        updatePortDropdown();

        // Auto-refresh every 5 seconds if not connected
        setInterval(() => {
            if (!isConnected) {
                updatePortDropdown();
            }
        }, 5000);

        // Immediate refresh on Web Serial events if supported
        if (isSupported()) {
            navigator.serial.addEventListener('connect', () => {
                if (!isConnected) updatePortDropdown();
            });
            navigator.serial.addEventListener('disconnect', () => {
                if (!isConnected) updatePortDropdown();
            });
        }
    }

    return { isSupported, requestPort, connect, disconnect, send, clearOutput, init, isConnected: () => isConnected };
})();
