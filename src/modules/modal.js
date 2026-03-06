/**
 * Lightweight vanilla JS modal system
 * Replaces Bootstrap modal functionality.
 */

export const Modal = {
    show(id) {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'flex';
            // Close on overlay click
            el.addEventListener('click', (e) => {
                if (e.target === el) Modal.hide(id);
            });
        }
    },

    hide(id) {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    },

    init() {
        // Wire up all [data-dismiss] buttons
        document.querySelectorAll('[data-dismiss]').forEach(btn => {
            btn.addEventListener('click', () => {
                Modal.hide(btn.dataset.dismiss);
            });
        });
    }
};
