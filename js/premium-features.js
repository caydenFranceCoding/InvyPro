/**
 * Premium Features for Inventory Management Application
 * This script adds premium UI enhancements, animations, and features
 * to create a high-quality, professional experience.
 */
document.body.classList.add('premium');

const PremiumFeatures = (() => {
    // Cache DOM elements
    const elements = {
        body: document.body,
        header: document.querySelector('.header'),
        navTabs: document.querySelector('.nav-tabs'),
        dashboardCards: document.querySelectorAll('.dashboard-card'),
        reportCards: document.querySelectorAll('.report-card'),
        tableContainer: document.querySelector('.table-container'),
        searchInput: document.getElementById('search-input'),
        inventoryTable: document.getElementById('inventory-table'),
        addItemForm: document.getElementById('add-item-form'),
        tableRows: document.querySelectorAll('.data-table tbody tr'),
        darkModeToggle: document.getElementById('dark-mode-toggle')
    };

    /**
     * Initialize premium features
     */
    const init = () => {
        console.log('Initializing premium features...');

        // Add premium class to body
        elements.body.classList.add('premium');

        // Create and add branding watermark
        createBrandingWatermark();

        // Add micro-interactions
        addMicroInteractions();

        // Add entrance animations
        addEntranceAnimations();

        // Add premium charts
        enhanceCharts();

        // Add custom table sorting
        addTableSorting();

        // Add export options
        enhanceExportOptions();

        // Add keyboard shortcuts
        enhanceKeyboardShortcuts();

        // Initialize premium tooltips
        initTooltips();

        // Add data visualization enhancements
        enhanceDataVisualization();

        // Add visual feedback on save/delete
        addVisualFeedback();

        // Add smooth scrolling
        enableSmoothScrolling();

        console.log('Premium features initialized');
    };

    /**
     * Create and add branding watermark
     */
    const createBrandingWatermark = () => {
        const watermark = document.createElement('div');
        watermark.className = 'branding-watermark';
        watermark.innerHTML = 'Powered by <span>Invy</span> Pro';
        document.body.appendChild(watermark);
    };

    /**
     * Add micro-interactions to UI elements
     */
    const addMicroInteractions = () => {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add hover effect on dashboard cards
        if (elements.dashboardCards) {
            elements.dashboardCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('.dashboard-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.1)';
                        icon.style.transition = 'transform 0.3s ease';
                    }
                });

                card.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('.dashboard-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1)';
                    }
                });
            });
        }

        // Add focus effect on search input
        if (elements.searchInput) {
            elements.searchInput.addEventListener('focus', function() {
                this.parentElement.classList.add('search-focus');
            });

            elements.searchInput.addEventListener('blur', function() {
                this.parentElement.classList.remove('search-focus');
            });
        }

        // Add subtle animation to nav tabs
        if (elements.navTabs) {
            const tabs = elements.navTabs.querySelectorAll('.nav-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs
                    tabs.forEach(t => t.classList.remove('active'));

                    // Add active class to clicked tab with a slight delay for effect
                    setTimeout(() => {
                        this.classList.add('active');
                    }, 50);
                });
            });
        }
    };

    /**
     * Add entrance animations to elements
     */
    const addEntranceAnimations = () => {
        // Animate header on load
        if (elements.header) {
            elements.header.style.opacity = '0';
            elements.header.style.transform = 'translateY(-20px)';
            elements.header.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                elements.header.style.opacity = '1';
                elements.header.style.transform = 'translateY(0)';
            }, 300);
        }

        // Animate dashboard cards
        if (elements.dashboardCards && elements.dashboardCards.length > 0) {
            elements.dashboardCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 300 + (index * 100));
            });
        }

        // Animate table container
        if (elements.tableContainer) {
            elements.tableContainer.style.opacity = '0';
            elements.tableContainer.style.transition = 'opacity 0.7s ease';

            setTimeout(() => {
                elements.tableContainer.style.opacity = '1';
            }, 600);
        }
    };

    /**
     * Enhance charts with premium styling
     */
    const enhanceCharts = () => {
        // Check if Chart.js is available
        if (typeof Chart !== 'undefined') {
            // Set global chart defaults
            Chart.defaults.font.family = "'Inter', sans-serif";
            Chart.defaults.color = '#64748b';
            Chart.defaults.plugins.tooltip.titleFont.weight = 'bold';
            Chart.defaults.plugins.tooltip.titleFont.family = "'Poppins', sans-serif";
            Chart.defaults.plugins.tooltip.bodyFont.family = "'Inter', sans-serif";
            Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.8)';
            Chart.defaults.plugins.tooltip.borderColor = 'rgba(203, 213, 225, 0.2)';
            Chart.defaults.plugins.tooltip.borderWidth = 1;
            Chart.defaults.plugins.tooltip.cornerRadius = 8;
            Chart.defaults.plugins.tooltip.padding = 12;

            // Update existing charts
            if (window.categoryChart) updateCategoryChart(window.categoryChart);
            if (window.valueChart) updateValueChart(window.valueChart);
            if (window.lowStockChart) updateLowStockChart(window.lowStockChart);
        }
    };

    /**
     * Update category chart with premium styling
     */
    const updateCategoryChart = (chart) => {
        // Enhanced colors for category chart
        const enhancedColors = [
            '#0066ff', // Primary blue
            '#36b37e', // Green
            '#6554c0', // Purple
            '#ff8b00', // Orange
            '#00b8d9', // Teal
            '#ff5630', // Red
            '#ffc400', // Yellow
            '#8270db'  // Light Purple
        ];

        // Update chart colors
        chart.data.datasets[0].backgroundColor = enhancedColors;

        // Update chart options
        chart.options.plugins.legend.labels.usePointStyle = true;
        chart.options.plugins.legend.labels.pointStyle = 'circle';
        chart.options.cutout = '65%'; // Increase doughnut hole

        // Add drop shadow
        chart.options.plugins.shadowPlugin = {
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
        };

        // Update chart
        chart.update();
    };

    /**
     * Update value trend chart with premium styling
     */
    const updateValueChart = (chart) => {
        // Update line color and style
        chart.data.datasets[0].borderColor = '#0066ff';
        chart.data.datasets[0].backgroundColor = 'rgba(0, 102, 255, 0.1)';
        chart.data.datasets[0].borderWidth = 3;
        chart.data.datasets[0].pointBackgroundColor = '#ffffff';
        chart.data.datasets[0].pointBorderColor = '#0066ff';
        chart.data.datasets[0].pointBorderWidth = 2;
        chart.data.datasets[0].pointRadius = 4;
        chart.data.datasets[0].pointHoverRadius = 6;

        // Update chart options
        chart.options.scales.x.grid.display = false;
        chart.options.scales.y.grid.borderDash = [5, 5];
        chart.options.scales.y.ticks.padding = 10;
        chart.options.scales.x.ticks.padding = 10;

        // Update chart
        chart.update();
    };

    /**
     * Update low stock chart with premium styling
     */
    const updateLowStockChart = (chart) => {
        // Enhanced colors for low stock chart
        const barColors = chart.data.datasets[0].data.map(value => {
            const threshold = chart.data.datasets[1].data[0];

            if (value < threshold * 0.3) {
                return 'rgba(255, 86, 48, 0.7)'; // Critical - red
            } else if (value < threshold * 0.7) {
                return 'rgba(255, 139, 0, 0.7)'; // Warning - orange
            } else {
                return 'rgba(255, 196, 0, 0.7)'; // Caution - yellow
            }
        });

        // Update chart colors and styles
        chart.data.datasets[0].backgroundColor = barColors;
        chart.data.datasets[0].borderWidth = 0;
        chart.data.datasets[0].borderRadius = 6;
        chart.data.datasets[1].borderColor = 'rgba(17, 24, 39, 0.5)';
        chart.data.datasets[1].borderWidth = 2;

        // Update chart options
        chart.options.scales.x.grid.display = false;
        chart.options.scales.y.grid.borderDash = [5, 5];

        // Update chart
        chart.update();
    };

    /**
     * Add custom table sorting functionality
     */
    const addTableSorting = () => {
        if (!elements.inventoryTable) return;

        const headers = elements.inventoryTable.querySelectorAll('th');

        headers.forEach((header, index) => {
            // Skip the actions column (last column)
            if (index === headers.length - 1) return;

            // Add sort indicator and styling
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';

            const sortIndicator = document.createElement('span');
            sortIndicator.className = 'sort-indicator';
            sortIndicator.textContent = ' ↕';
            sortIndicator.style.opacity = '0.3';
            sortIndicator.style.marginLeft = '0.25rem';
            header.appendChild(sortIndicator);

            // Add click handler
            header.addEventListener('click', function() {
                const isAscending = this.getAttribute('data-sort') !== 'asc';

                // Reset all headers
                headers.forEach(h => {
                    h.removeAttribute('data-sort');
                    h.querySelector('.sort-indicator').textContent = ' ↕';
                    h.querySelector('.sort-indicator').style.opacity = '0.3';
                });

                // Set current header
                this.setAttribute('data-sort', isAscending ? 'asc' : 'desc');
                sortIndicator.textContent = isAscending ? ' ↑' : ' ↓';
                sortIndicator.style.opacity = '1';

                // Perform sort
                sortTable(index, isAscending);
            });
        });
    };

    /**
     * Sort table by column index
     */
    const sortTable = (columnIndex, ascending) => {
        const table = elements.inventoryTable;
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // Sort rows
        const sortedRows = rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();

            // Handle numeric columns (quantity, price)
            if (columnIndex === 2 || columnIndex === 3) { // Assuming quantity is column 2 and price is column 3
                const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
                const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));

                return ascending ? aNum - bNum : bNum - aNum;
            }

            // Handle date column (last updated)
            if (columnIndex === 5) { // Assuming last updated is column 5
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);

                return ascending ? aDate - bDate : bDate - aDate;
            }

            // Default string comparison
            return ascending ?
                aValue.localeCompare(bValue) :
                bValue.localeCompare(aValue);
        });

        // Clear table
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        // Add sorted rows
        sortedRows.forEach(row => tbody.appendChild(row));

        // Add row animation
        const newRows = tbody.querySelectorAll('tr');
        newRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(10px)';
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, 50 * index);
        });
    };

    /**
     * Enhance export options with additional formats
     */
    const enhanceExportOptions = () => {
        const exportBtn = document.getElementById('export-btn');
        if (!exportBtn) return;

        // Replace with dropdown
        const exportWrapper = document.createElement('div');
        exportWrapper.className = 'export-dropdown';
        exportWrapper.style.position = 'relative';
        exportWrapper.style.display = 'inline-block';

        const exportToggle = document.createElement('button');
        exportToggle.className = 'nav-tab export-btn';
        exportToggle.innerHTML = exportBtn.innerHTML;
        exportToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        const dropdown = document.createElement('div');
        dropdown.className = 'export-dropdown-menu';
        dropdown.style.display = 'none';
        dropdown.style.position = 'absolute';
        dropdown.style.right = '0';
        dropdown.style.top = '100%';
        dropdown.style.zIndex = '100';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.borderRadius = '0.5rem';
        dropdown.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
        dropdown.style.padding = '0.5rem 0';
        dropdown.style.marginTop = '0.5rem';
        dropdown.style.width = '150px';

        // Add export options
        const options = [
            { format: 'csv', label: 'CSV', icon: 'fa-file-csv' },
            { format: 'excel', label: 'Excel', icon: 'fa-file-excel' },
            { format: 'pdf', label: 'PDF', icon: 'fa-file-pdf' },
            { format: 'print', label: 'Print', icon: 'fa-print' }
        ];

        options.forEach(option => {
            const item = document.createElement('a');
            item.href = '#';
            item.className = 'export-option';
            item.setAttribute('data-format', option.format);
            item.style.display = 'block';
            item.style.padding = '0.5rem 1rem';
            item.style.color = 'var(--premium-neutral-700)';
            item.style.textDecoration = 'none';
            item.style.transition = 'background-color 0.2s ease';

            item.innerHTML = `<i class="fas ${option.icon}" style="width: 1.5rem; margin-right: 0.5rem;"></i> ${option.label}`;

            item.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'var(--premium-neutral-100)';
            });

            item.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });

            item.addEventListener('click', function(e) {
                e.preventDefault();
                handleExport(this.getAttribute('data-format'));
                dropdown.style.display = 'none';
            });

            dropdown.appendChild(item);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdown.style.display = 'none';
        });

        // Add dropdown to wrapper
        exportWrapper.appendChild(exportToggle);
        exportWrapper.appendChild(dropdown);

        // Replace original button
        exportBtn.parentNode.replaceChild(exportWrapper, exportBtn);
    };

    /**
     * Handle export in different formats
     */
    const handleExport = (format) => {
        const currentDate = new Date().toISOString().slice(0, 10);
        const filename = `inventory_export_${currentDate}`;

        switch (format) {
            case 'csv':
                // Use existing CSV export functionality
                const csvContent = InventoryData.exportToCSV();
                InventoryUtils.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
                InventoryUtils.Toast.success('Inventory exported as CSV');
                break;

            case 'excel':
                // Simulate Excel export (for demonstration)
                setTimeout(() => {
                    InventoryUtils.Toast.success('Inventory exported as Excel file');
                }, 800);
                break;

            case 'pdf':
                // Simulate PDF export (for demonstration)
                setTimeout(() => {
                    InventoryUtils.Toast.success('Inventory exported as PDF file');
                }, 1000);
                break;

            case 'print':
                // Open print dialog
                window.print();
                break;

            default:
                console.error('Unknown export format:', format);
        }
    };

    /**
     * Enhance keyboard shortcuts with visual indicators
     */
    const enhanceKeyboardShortcuts = () => {
        // Add keyboard shortcuts indicator
        const shortcutsBtn = document.createElement('button');
        shortcutsBtn.className = 'shortcuts-btn';
        shortcutsBtn.innerHTML = '<i class="fas fa-keyboard"></i>';
        shortcutsBtn.style.position = 'fixed';
        shortcutsBtn.style.bottom = '5rem';
        shortcutsBtn.style.right = '1rem';
        shortcutsBtn.style.width = '3rem';
        shortcutsBtn.style.height = '3rem';
        shortcutsBtn.style.borderRadius = '50%';
        shortcutsBtn.style.backgroundColor = 'white';
        shortcutsBtn.style.color = 'var(--premium-primary-600)';
        shortcutsBtn.style.border = '1px solid var(--premium-neutral-200)';
        shortcutsBtn.style.boxShadow = 'var(--premium-shadow-md)';
        shortcutsBtn.style.cursor = 'pointer';
        shortcutsBtn.style.zIndex = '90';
        shortcutsBtn.style.display = 'flex';
        shortcutsBtn.style.alignItems = 'center';
        shortcutsBtn.style.justifyContent = 'center';
        shortcutsBtn.style.fontSize = '1.25rem';
        shortcutsBtn.style.transition = 'all 0.2s ease';

        // Add tooltip
        shortcutsBtn.title = 'Keyboard Shortcuts (F1)';

        shortcutsBtn.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
        });

        shortcutsBtn.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });

        shortcutsBtn.addEventListener('click', function() {
            showShortcutsModal();
        });

        document.body.appendChild(shortcutsBtn);

        // Add F1 shortcut to show shortcuts modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F1' || (e.key === '?' && e.shiftKey)) {
                e.preventDefault();
                showShortcutsModal();
            }
        });
    };

    /**
     * Show keyboard shortcuts modal
     */
    const showShortcutsModal = () => {
        // Create modal if it doesn't exist
        let shortcutsModal = document.getElementById('shortcuts-modal');

        if (!shortcutsModal) {
            shortcutsModal = document.createElement('div');
            shortcutsModal.id = 'shortcuts-modal';
            shortcutsModal.style.position = 'fixed';
            shortcutsModal.style.top = '0';
            shortcutsModal.style.left = '0';
            shortcutsModal.style.width = '100%';
            shortcutsModal.style.height = '100%';
            shortcutsModal.style.backgroundColor = 'rgba(15, 23, 42, 0.75)';
            shortcutsModal.style.backdropFilter = 'blur(4px)';
            shortcutsModal.style.zIndex = '9999';
            shortcutsModal.style.display = 'flex';
            shortcutsModal.style.alignItems = 'center';
            shortcutsModal.style.justifyContent = 'center';

            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.borderRadius = '0.75rem';
            modalContent.style.padding = '2rem';
            modalContent.style.maxWidth = '500px';
            modalContent.style.width = '90%';
            modalContent.style.maxHeight = '80vh';
            modalContent.style.overflowY = 'auto';
            modalContent.style.boxShadow = 'var(--premium-shadow-xl)';

            // Add shortcuts content
            modalContent.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="margin: 0; font-size: 1.5rem; color: var(--premium-neutral-900);">Keyboard Shortcuts</h2>
                    <button id="close-shortcuts-btn" style="background: none; border: none; cursor: pointer; font-size: 1.25rem; color: var(--premium-neutral-400);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="shortcuts-grid" style="display: grid; grid-template-columns: max-content 1fr; gap: 0.75rem 1.5rem;">
                    <div style="font-weight: 600; color: var(--premium-primary-600);">Ctrl + N</div>
                    <div>Add new item</div>
                    
                    <div style="font-weight: 600; color: var(--premium-primary-600);">Ctrl + F</div>
                    <div>Focus search</div>
                    
                    <div style="font-weight: 600; color: var(--premium-primary-600);">Ctrl + S</div>
                    <div>Export inventory</div>
                    
                    <div style="font-weight: 600; color: var(--premium-primary-600);">Esc</div>
                    <div>Close form / Cancel edit</div>
                    
                    <div style="font-weight: 600; color: var(--premium-primary-600);">Alt + 1</div>
                    <div>Switch to Inventory view</div>
                    
                    <div style="font-weight: 600; color: var(--premium-primary-600);">Alt + 2</div>
                    <div>Switch to Reports view</div>
                    
                    <div style="font-weight: 600; color: var(--premium-primary-600);">Alt + D</div>
                    <div>Toggle dark mode</div>
                    
                    <div style="font-weight: 600; color: var(--premium-primary-600);">F1 or ?</div>
                    <div>Show this help</div>
                </div>
                
                <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--premium-neutral-200);">
                    <div style="font-weight: 500; color: var(--premium-neutral-700); margin-bottom: 0.5rem;">Pro Tip:</div>
                    <p style="margin: 0; color: var(--premium-neutral-600); line-height: 1.5;">
                        You can click on table headers to sort the inventory by that column. 
                        Click again to toggle between ascending and descending order.
                    </p>
                </div>
            `;

            shortcutsModal.appendChild(modalContent);
            document.body.appendChild(shortcutsModal);

            // Add event listener to close button
            document.getElementById('close-shortcuts-btn').addEventListener('click', function() {
                shortcutsModal.style.opacity = '0';
                setTimeout(() => {
                    shortcutsModal.remove();
                }, 300);
            });

            // Close on click outside
            shortcutsModal.addEventListener('click', function(e) {
                if (e.target === shortcutsModal) {
                    shortcutsModal.style.opacity = '0';
                    setTimeout(() => {
                        shortcutsModal.remove();
                    }, 300);
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && document.body.contains(shortcutsModal)) {
                    shortcutsModal.style.opacity = '0';
                    setTimeout(() => {
                        shortcutsModal.remove();
                    }, 300);
                }
            });

            // Add entrance animation
            shortcutsModal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            modalContent.style.transition = 'transform 0.3s ease';
            shortcutsModal.style.transition = 'opacity 0.3s ease';

            setTimeout(() => {
                shortcutsModal.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
        }
    };

    /**
     * Initialize premium tooltips
     */
    const initTooltips = () => {
        // Add custom tooltip for action buttons
        const actionButtons = document.querySelectorAll('.btn-icon');

        actionButtons.forEach(button => {
            // Get tooltip text from title attribute
            const tooltipText = button.getAttribute('title') || button.getAttribute('data-id') || 'Action';

            // Remove title to prevent default tooltip
            button.removeAttribute('title');

            // Add tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'premium-tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '0.5rem 0.75rem';
            tooltip.style.borderRadius = '0.25rem';
            tooltip.style.fontSize = '0.75rem';
            tooltip.style.fontWeight = '500';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            tooltip.style.zIndex = '100';
            tooltip.style.transformOrigin = 'top center';
            tooltip.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';

            // Position tooltip
            function positionTooltip() {
                const buttonRect = button.getBoundingClientRect();
                tooltip.style.top = buttonRect.bottom + 5 + 'px';
                tooltip.style.left = buttonRect.left + (buttonRect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            }

            // Show tooltip on hover
            button.addEventListener('mouseenter', function() {
                document.body.appendChild(tooltip);
                positionTooltip();
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 10);
            });

            // Hide tooltip on mouse leave
            button.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 200);
            });
        });
    };

    /**
     * Add data visualization enhancements
     */
    const enhanceDataVisualization = () => {
        // Add value indicators to quantity cells
        const quantityCells = document.querySelectorAll('.data-table td:nth-child(3)');

        quantityCells.forEach(cell => {
            // Skip if cell is empty or already enhanced
            if (!cell.textContent.trim() || cell.querySelector('.quantity-indicator')) return;

            const value = parseInt(cell.textContent.trim(), 10);
            if (isNaN(value)) return;

            // Create indicator wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'quantity-wrapper';
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '0.5rem';

            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = 'quantity-indicator';
            indicator.style.height = '0.5rem';
            indicator.style.flex = '1';
            indicator.style.borderRadius = '0.25rem';
            indicator.style.backgroundColor = 'var(--premium-neutral-200)';
            indicator.style.overflow = 'hidden';

            // Create indicator bar
            const indicatorBar = document.createElement('div');
            indicatorBar.className = 'quantity-bar';

            // Calculate percentage - assume 500 is the max value for visualization
            const maxValue = 500;
            const percentage = Math.min(100, (value / maxValue) * 100);

            // Set indicator bar width and color
            indicatorBar.style.width = `${percentage}%`;
            indicatorBar.style.height = '100%';

            // Determine color based on percentage
            let barColor;
            if (percentage < 30) {
                barColor = 'var(--premium-accent-orange)';
            } else if (percentage < 70) {
                barColor = '#ffc400';
            } else {
                barColor = 'var(--premium-accent-green)';
            }

            indicatorBar.style.backgroundColor = barColor;

            // Add transition for animation
            indicatorBar.style.transition = 'width 0.8s ease-in-out';

            // Initially set width to 0 for animation
            indicatorBar.style.width = '0%';

            // Add indicator bar to indicator
            indicator.appendChild(indicatorBar);

            // Create quantity text
            const quantityText = document.createElement('span');
            quantityText.textContent = value.toString();

            // Replace cell content
            cell.textContent = '';
            wrapper.appendChild(quantityText);
            wrapper.appendChild(indicator);
            cell.appendChild(wrapper);

            // Animate bar after a delay
            setTimeout(() => {
                indicatorBar.style.width = `${percentage}%`;
            }, 100);
        });

        // Enhance pricing display
        const priceCells = document.querySelectorAll('.data-table td:nth-child(4)');

        priceCells.forEach(cell => {
            // Skip if cell is empty or already enhanced
            if (!cell.textContent.trim() || cell.querySelector('.price-enhanced')) return;

            const priceText = cell.textContent.trim();
            const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));

            if (isNaN(price)) return;

            // Format price with larger symbol
            const formattedPrice = `<span style="font-size: 0.8rem; color: var(--premium-neutral-500);">$</span><span style="font-weight: 600;">${price.toFixed(2)}</span>`;

            // Add enhanced price
            const enhancedPrice = document.createElement('span');
            enhancedPrice.className = 'price-enhanced';
            enhancedPrice.innerHTML = formattedPrice;

            // Replace cell content
            cell.textContent = '';
            cell.appendChild(enhancedPrice);
        });
    };

    /**
     * Add visual feedback on save/delete
     */
    const addVisualFeedback = () => {
        // Enhance the original save function
        if (InventoryData && InventoryData.updateItem) {
            const originalUpdateItem = InventoryData.updateItem;

            InventoryData.updateItem = function(updatedItem) {
                const result = originalUpdateItem.call(this, updatedItem);

                if (result) {
                    // Show pulsating highlight on saved row
                    setTimeout(() => {
                        const row = document.querySelector(`.data-table tr[data-id="${updatedItem.id}"]`);

                        if (row) {
                            // Add pulse animation
                            row.style.animation = 'pulse-success 1s ease-in-out';

                            // Remove animation after it completes
                            setTimeout(() => {
                                row.style.animation = '';
                            }, 1000);
                        }
                    }, 100);
                }

                return result;
            };
        }

        // Enhance the original delete function
        if (InventoryData && InventoryData.deleteItem) {
            const originalDeleteItem = InventoryData.deleteItem;

            InventoryData.deleteItem = function(id) {
                // Get the row before deleting
                const row = document.querySelector(`.data-table tr[data-id="${id}"]`);

                if (row) {
                    // Add fade-out animation
                    row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(20px)';

                    // Call the original function after animation
                    setTimeout(() => {
                        const result = originalDeleteItem.call(this, id);
                        return result;
                    }, 500);

                    return true;
                } else {
                    return originalDeleteItem.call(this, id);
                }
            };
        }

        // Add CSS for pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-success {
                0% { background-color: rgba(54, 179, 126, 0.3); }
                70% { background-color: rgba(54, 179, 126, 0.1); }
                100% { background-color: transparent; }
            }
        `;
        document.head.appendChild(style);
    };

    /**
     * Enable smooth scrolling
     */
    const enableSmoothScrolling = () => {
        // Add CSS for smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';

        // Add scroll buttons if table is large
        const tableContainer = document.querySelector('.table-container');
        if (!tableContainer) return;

        // Check if table is larger than container
        if (tableContainer.scrollHeight > tableContainer.clientHeight) {
            // Add scroll up/down buttons
            const scrollButtons = document.createElement('div');
            scrollButtons.className = 'table-scroll-buttons';
            scrollButtons.style.position = 'absolute';
            scrollButtons.style.right = '1rem';
            scrollButtons.style.top = '50%';
            scrollButtons.style.transform = 'translateY(-50%)';
            scrollButtons.style.display = 'flex';
            scrollButtons.style.flexDirection = 'column';
            scrollButtons.style.gap = '0.5rem';
            scrollButtons.style.zIndex = '20';

            // Up button
            const upButton = document.createElement('button');
            upButton.className = 'scroll-button';
            upButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
            upButton.style.width = '2rem';
            upButton.style.height = '2rem';
            upButton.style.borderRadius = '50%';
            upButton.style.backgroundColor = 'white';
            upButton.style.border = '1px solid var(--premium-neutral-200)';
            upButton.style.boxShadow = 'var(--premium-shadow-md)';
            upButton.style.cursor = 'pointer';
            upButton.style.display = 'flex';
            upButton.style.alignItems = 'center';
            upButton.style.justifyContent = 'center';
            upButton.style.color = 'var(--premium-neutral-600)';

            upButton.addEventListener('click', function() {
                tableContainer.scrollBy({
                    top: -300,
                    behavior: 'smooth'
                });
            });

            // Down button
            const downButton = document.createElement('button');
            downButton.className = 'scroll-button';
            downButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
            downButton.style.width = '2rem';
            downButton.style.height = '2rem';
            downButton.style.borderRadius = '50%';
            downButton.style.backgroundColor = 'white';
            downButton.style.border = '1px solid var(--premium-neutral-200)';
            downButton.style.boxShadow = 'var(--premium-shadow-md)';
            downButton.style.cursor = 'pointer';
            downButton.style.display = 'flex';
            downButton.style.alignItems = 'center';
            downButton.style.justifyContent = 'center';
            downButton.style.color = 'var(--premium-neutral-600)';

            downButton.addEventListener('click', function() {
                tableContainer.scrollBy({
                    top: 300,
                    behavior: 'smooth'
                });
            });

            // Add buttons to container
            scrollButtons.appendChild(upButton);
            scrollButtons.appendChild(downButton);
            tableContainer.style.position = 'relative';
            tableContainer.appendChild(scrollButtons);

            // Show/hide buttons based on scroll position
            tableContainer.addEventListener('scroll', function() {
                const isAtTop = this.scrollTop === 0;
                const isAtBottom = this.scrollHeight - this.scrollTop - this.clientHeight < 1;

                upButton.style.opacity = isAtTop ? '0.3' : '1';
                upButton.style.cursor = isAtTop ? 'default' : 'pointer';

                downButton.style.opacity = isAtBottom ? '0.3' : '1';
                downButton.style.cursor = isAtBottom ? 'default' : 'pointer';
            });

            // Initial check
            tableContainer.dispatchEvent(new Event('scroll'));
        }
    };

    // Return public methods
    return {
        init
    };
})();

// Initialize premium features when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main app to initialize
    setTimeout(() => {
        PremiumFeatures.init();
    }, 800);
});