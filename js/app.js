const InventoryApp = (() => {
    // Application state
    const state = {
        initialized: false,
        darkMode: false,
        lastSync: null
    };

    // Check for application requirements
    const checkRequirements = () => {
        // Check for localStorage support (critical requirement)
        if (!InventoryUtils.isLocalStorageAvailable()) {
            showError('This application requires localStorage support. Please use a modern browser.');
            return false;
        }

        return true;
    };

    // Initialize desktop app specific features (placeholder for future expansion)
    const initDesktopFeatures = () => {
        // This function would be expanded when converting to Electron
        console.log('Desktop features ready for implementation');

        // Add a note in the UI about desktop features
        const appContainer = document.querySelector('.app-container');
        const desktopNote = document.createElement('div');
        desktopNote.classList.add('desktop-note');
        desktopNote.textContent = 'Ready for desktop app conversion';
        desktopNote.style.position = 'fixed';
        desktopNote.style.bottom = '10px';
        desktopNote.style.right = '10px';
        desktopNote.style.background = 'rgba(0,0,0,0.1)';
        desktopNote.style.padding = '5px 10px';
        desktopNote.style.borderRadius = '4px';
        desktopNote.style.fontSize = '12px';
        appContainer.appendChild(desktopNote);
    };

    // Display critical errors
    const showError = (message) => {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        errorElement.style.color = 'white';
        errorElement.style.backgroundColor = '#ef4444';
        errorElement.style.padding = '1rem';
        errorElement.style.margin = '1rem';
        errorElement.style.borderRadius = '0.25rem';
        errorElement.style.textAlign = 'center';

        document.body.prepend(errorElement);
    };

    // Add icons to replace placeholders (for development only)
    const addTemporaryIcons = () => {
        // Simple CSS to add basic icons using unicode characters
        const iconStyle = document.createElement('style');

        iconStyle.textContent = `
            .icon-document:before { content: "📄"; }
            .icon-chart:before { content: "📊"; }
            .icon-download:before { content: "⬇️"; }
            .icon-search:before { content: "🔍"; }
            .icon-plus:before { content: "➕"; }
            .icon-edit:before { content: "✏️"; }
            .icon-delete:before { content: "🗑️"; }
            .icon-save:before { content: "💾"; }
            .icon-close:before { content: "❌"; }
        `;

        document.head.appendChild(iconStyle);
    };

    // Register service worker for PWA support (placeholder for future expansion)
    const registerServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // This would be implemented when adding PWA support
                console.log('Service Worker ready for implementation');
            });
        }
    };

    // Initialize autosave feature
    const initAutoSave = () => {
        // Listen for form input changes and save automatically
        const formInputs = document.querySelectorAll('#add-item-form input, #add-item-form select');

        formInputs.forEach(input => {
            input.addEventListener('change', () => {
                // Store the current form state in localStorage
                const formData = {
                    name: document.getElementById('item-name').value,
                    category: document.getElementById('item-category').value,
                    quantity: document.getElementById('item-quantity').value,
                    price: document.getElementById('item-price').value,
                    location: document.getElementById('item-location').value
                };

                localStorage.setItem('form_autosave', JSON.stringify(formData));
            });
        });

        // Check for autosaved form data
        const savedForm = localStorage.getItem('form_autosave');
        if (savedForm) {
            try {
                const formData = JSON.parse(savedForm);

                // Populate form with saved data
                document.getElementById('item-name').value = formData.name || '';
                document.getElementById('item-category').value = formData.category || '';
                document.getElementById('item-quantity').value = formData.quantity || 0;
                document.getElementById('item-price').value = formData.price || 0;
                document.getElementById('item-location').value = formData.location || '';
            } catch (e) {
                console.error('Error loading autosave data:', e);
                // Clear corrupted data
                localStorage.removeItem('form_autosave');
            }
        }
    };

    // Handle keyboard shortcuts
    const initKeyboardShortcuts = () => {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S for export
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                document.getElementById('export-btn').click();
            }

            // Ctrl/Cmd + F for search focus
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }

            // Ctrl/Cmd + N for new item
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.getElementById('add-item-btn').click();
            }

            // Escape to close form
            if (e.key === 'Escape') {
                const addForm = document.getElementById('add-item-form');
                if (!addForm.classList.contains('hidden')) {
                    document.getElementById('close-form-btn').click();
                }
            }
        });
    };

    // Implement responsive behavior
    const initResponsiveFeatures = () => {
        const handleResize = () => {
            const isMobile = InventoryUtils.isMobileDevice() || window.innerWidth < 768;
            document.body.classList.toggle('mobile-view', isMobile);

            // Adjust table for mobile view
            const table = document.getElementById('inventory-table');
            if (table) {
                if (isMobile) {
                    table.classList.add('mobile-table');
                } else {
                    table.classList.remove('mobile-table');
                }
            }
        };

        // Initial check
        handleResize();

        // Listen for window resize
        window.addEventListener('resize', InventoryUtils.debounce(handleResize, 250));
    };

    // Initialize print handling
    const initPrintFeatures = () => {
        // When user prints, make sure reports are visible
        window.addEventListener('beforeprint', () => {
            // Temporarily show the reports view if it's hidden
            const reportsView = document.getElementById('reports-view');
            const wasHidden = reportsView.classList.contains('hidden');

            if (wasHidden) {
                reportsView.classList.remove('hidden');
                reportsView.dataset.tempVisible = 'true';
            }
        });

        window.addEventListener('afterprint', () => {
            // Restore previous visibility
            const reportsView = document.getElementById('reports-view');

            if (reportsView.dataset.tempVisible === 'true') {
                reportsView.classList.add('hidden');
                delete reportsView.dataset.tempVisible;
            }
        });
    };

    // Add help tooltips
    const addTooltips = () => {
        const tooltips = [
            { selector: '#add-item-btn', text: 'Add a new inventory item' },
            { selector: '#export-btn', text: 'Export inventory to CSV' },
            { selector: '#inventory-tab', text: 'View and manage inventory' },
            { selector: '#reports-tab', text: 'View inventory reports and analytics' },
            { selector: '#search-input', text: 'Search by name or category' },
            { selector: '#threshold-input', text: 'Set low stock alert threshold' }
        ];

        tooltips.forEach(tooltip => {
            const element = document.querySelector(tooltip.selector);
            if (element) {
                element.title = tooltip.text;
            }
        });
    };

    // Public methods
    return {
        /**
         * Initialize the application
         */
        init() {
            console.log('Initializing Inventory Management Application...');

            if (state.initialized) {
                console.warn('Application already initialized');
                return false;
            }

            // Check requirements
            if (!checkRequirements()) {
                return false;
            }

            // Add temporary icons (for development only)
            addTemporaryIcons();

            // Initialize data module first
            InventoryData.init();

            // Then initialize UI
            InventoryUI.init();

            // Additional features
            initAutoSave();
            initKeyboardShortcuts();
            initResponsiveFeatures();
            initPrintFeatures();
            addTooltips();

            // Desktop features (placeholder for future Electron implementation)
            initDesktopFeatures();

            // Register service worker (placeholder for future PWA support)
            registerServiceWorker();

            state.initialized = true;
            state.lastSync = InventoryUtils.getCurrentDate();

            console.log('Application initialization complete');
            return true;
        }
    };
})();

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    InventoryApp.init();
});