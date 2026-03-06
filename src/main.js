/**
 * EMMI BOT IDE — Entry Point
 * Imports all modules and initializes the application.
 */

// CSS (Vite handles this)
import './styles/main.css';

// App modules
import { Modal } from './modules/modal.js';
import { SerialBridge } from './modules/serial.js';
import { CompilerBridge } from './modules/compiler.js';
import { AIChat } from './modules/ai-chat.js';
import { App } from './modules/app.js';

// Initialize everything when DOM is ready
function boot() {
    Modal.init();
    SerialBridge.init();
    CompilerBridge.init();
    AIChat.init();
    App.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
