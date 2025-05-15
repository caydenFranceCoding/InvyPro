/**
 * ui.js
 * Handles all UI operations: rendering, DOM updates, and event handlers.
 */

const InventoryUI = (() => {
    // DOM Elements Cache
    const elements = {
        // View elements
        inventoryView: document.getElementById('inventory-view'),
        reportsView: document.getElementById('reports-view'),

        // Navigation tabs
        inventoryTab: document.getElementById('inventory-tab'),
        reportsTab: document.getElementById('reports-tab'),
        exportBtn: document.getElementById('export-btn'),

        // Controls
        searchInput: document.getElementById('search-input'),
        categoryFilter: document.getElementById('category-filter'),
        locationFilter: document.getElementById('location-filter'),

        // Add item elements
        addItemBtn: document.getElementById('add-item-btn'),
        addItemForm: document.getElementById('add-item-form'),
        closeFormBtn: document.getElementById('close-form-btn'),
        submitItemBtn: document.getElementById('submit-item-btn'),

        // Form inputs
        itemName: document.getElementById('item-name'),
        itemCategory: document.getElementById('item-category'),
        itemQuantity: document.getElementById('item-quantity'),
        itemPrice: document.getElementById('item-price'),
        itemLocation: document.getElementById('item-location'),

        // Table
        inventoryTable: document.getElementById('inventory-table'),

        // Reports elements
        totalItems: document.getElementById('total-items'),
        totalValue: document.getElementById('total-value'),
        categoryBreakdown: document.getElementById('category-breakdown'),
        thresholdInput: document.getElementById('threshold-input'),
        lowStockContainer: document.getElementById('low-stock-container')
    };

    // Private variables
    let currentView = 'inventory';
    let editingItemId = null;
    let lastUpdatedItem = null;

    // Private methods
    const showView = (viewName) => {
        // Hide all views
        elements.inventoryView.classList.add('hidden');
        elements.reportsView.classList.add('hidden');

        // Remove active class from all tabs
        elements.inventoryTab.classList.remove('active');
        elements.reportsTab.classList.remove('active');

        // Show selected view and activate tab
        if (viewName === 'inventory') {
            elements.inventoryView.classList.remove('hidden');
            elements.inventoryTab.classList.add('active');
        } else if (viewName === 'reports') {
            elements.reportsView.classList.remove('hidden');
            elements.reportsTab.classList.add('active');
            renderReports(); // Update reports when switching to reports view
        }

        currentView = viewName;
    };

    const clearAddItemForm = () => {
        elements.itemName.value = '';
        elements.itemCategory.value = '';
        elements.itemQuantity.value = 0;
        elements.itemPrice.value = 0;
        elements.itemLocation.value = '';

        // Remove any validation error styling
        const inputs = elements.addItemForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('invalid-input');
        });

        // Clear autosave data
        localStorage.removeItem('form_autosave');
    };

    const toggleAddItemForm = (show) => {
        if (show) {
            elements.addItemForm.classList.remove('hidden');
            // Focus on first input for better UX
            setTimeout(() => {
                elements.itemName.focus();
            }, 300);
        } else {
            elements.addItemForm.classList.add('hidden');
            clearAddItemForm();
        }
    };

    const validateForm = () => {
        let isValid = true;
        let firstInvalidInput = null;

        // Name validation
        if (!elements.itemName.value.trim()) {
            elements.itemName.classList.add('invalid-input');
            isValid = false;
            firstInvalidInput = elements.itemName;
        } else {
            elements.itemName.classList.remove('invalid-input');
        }

        // Category validation
        if (!elements.itemCategory.value) {
            elements.itemCategory.classList.add('invalid-input');
            isValid = false;
            if (!firstInvalidInput) firstInvalidInput = elements.itemCategory;
        } else {
            elements.itemCategory.classList.remove('invalid-input');
        }

        // Location validation
        if (!elements.itemLocation.value) {
            elements.itemLocation.classList.add('invalid-input');
            isValid = false;
            if (!firstInvalidInput) firstInvalidInput = elements.itemLocation;
        } else {
            elements.itemLocation.classList.remove('invalid-input');
        }

        // Focus on first invalid input
        if (firstInvalidInput) {
            firstInvalidInput.focus();
            InventoryUtils.Toast.error('Please fill in all required fields');
        }

        return isValid;
    };

    const getFormValues = () => {
        return {
            name: elements.itemName.value.trim(),
            category: elements.itemCategory.value,
            quantity: parseInt(elements.itemQuantity.value, 10) || 0,
            price: parseFloat(elements.itemPrice.value) || 0,
            location: elements.itemLocation.value
        };
    };

    const populateSelects = () => {
        // Clear existing options except the default
        while (elements.categoryFilter.options.length > 1) {
            elements.categoryFilter.remove(1);
        }

        while (elements.locationFilter.options.length > 1) {
            elements.locationFilter.remove(1);
        }

        while (elements.itemCategory.options.length > 1) {
            elements.itemCategory.remove(1);
        }

        while (elements.itemLocation.options.length > 1) {
            elements.itemLocation.remove(1);
        }

        // Get data from the data module
        const categories = InventoryData.getCategories();
        const locations = InventoryData.getLocations();

        // Populate category selects
        categories.forEach(category => {
            // For filter
            const filterOption = document.createElement('option');
            filterOption.value = category;
            filterOption.textContent = category;
            elements.categoryFilter.appendChild(filterOption);

            // For form
            const formOption = document.createElement('option');
            formOption.value = category;
            formOption.textContent = category;
            elements.itemCategory.appendChild(formOption);
        });

        // Populate location selects
        locations.forEach(location => {
            // For filter
            const filterOption = document.createElement('option');
            filterOption.value = location;
            filterOption.textContent = location;
            elements.locationFilter.appendChild(filterOption);

            // For form
            const formOption = document.createElement('option');
            formOption.value = location;
            formOption.textContent = location;
            elements.itemLocation.appendChild(formOption);
        });
    };

    const renderInventoryTable = (items) => {
        const tableBody = elements.inventoryTable.querySelector('tbody');
        tableBody.innerHTML = '';

        if (items.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 7;
            cell.textContent = 'No items found';
            cell.style.textAlign = 'center';
            cell.className = 'no-data-message';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        const lowStockThreshold = InventoryData.getLowStockThreshold();

        items.forEach(item => {
            const row = document.createElement('tr');

            // Highlight low stock
            if (item.quantity <= lowStockThreshold) {
                row.classList.add('low-stock');
            }

            // Highlight newly added/updated item
            if (lastUpdatedItem === item.id) {
                row.classList.add('new-item-highlight');
            }

            if (editingItemId === item.id) {
                // Edit mode
                row.classList.add('edit-mode');

                // Name field
                let cell = document.createElement('td');
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.value = item.name;
                nameInput.id = `edit-name-${item.id}`;
                cell.appendChild(nameInput);
                row.appendChild(cell);

                // Category field
                cell = document.createElement('td');
                const categorySelect = document.createElement('select');
                categorySelect.id = `edit-category-${item.id}`;

                // Add options to select
                InventoryData.getCategories().forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    if (category === item.category) {
                        option.selected = true;
                    }
                    categorySelect.appendChild(option);
                });

                // Add custom option
                const customOption = document.createElement('option');
                customOption.value = '__custom__';
                customOption.textContent = '+ Add New Category';
                categorySelect.appendChild(customOption);

                // Handle custom category
                categorySelect.addEventListener('change', () => {
                    if (categorySelect.value === '__custom__') {
                        const newCategory = prompt('Enter new category:');
                        if (newCategory && newCategory.trim()) {
                            // Add new option
                            const option = document.createElement('option');
                            option.value = newCategory.trim();
                            option.textContent = newCategory.trim();

                            // Insert before custom option
                            categorySelect.insertBefore(option, customOption);
                            categorySelect.value = newCategory.trim();
                        } else {
                            // Reset to previous value
                            categorySelect.value = item.category;
                        }
                    }
                });

                cell.appendChild(categorySelect);
                row.appendChild(cell);

                // Quantity field
                cell = document.createElement('td');
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.value = item.quantity;
                quantityInput.min = 0;
                quantityInput.id = `edit-quantity-${item.id}`;
                cell.appendChild(quantityInput);
                row.appendChild(cell);

                // Price field
                cell = document.createElement('td');
                const priceInput = document.createElement('input');
                priceInput.type = 'number';
                priceInput.value = item.price;
                priceInput.min = 0;
                priceInput.step = 0.01;
                priceInput.id = `edit-price-${item.id}`;
                cell.appendChild(priceInput);
                row.appendChild(cell);

                // Location field
                cell = document.createElement('td');
                const locationSelect = document.createElement('select');
                locationSelect.id = `edit-location-${item.id}`;

                // Add options to select
                InventoryData.getLocations().forEach(location => {
                    const option = document.createElement('option');
                    option.value = location;
                    option.textContent = location;
                    if (location === item.location) {
                        option.selected = true;
                    }
                    locationSelect.appendChild(option);
                });

                // Add custom option
                const customLocationOption = document.createElement('option');
                customLocationOption.value = '__custom__';
                customLocationOption.textContent = '+ Add New Location';
                locationSelect.appendChild(customLocationOption);

                // Handle custom location
                locationSelect.addEventListener('change', () => {
                    if (locationSelect.value === '__custom__') {
                        const newLocation = prompt('Enter new location:');
                        if (newLocation && newLocation.trim()) {
                            // Add new option
                            const option = document.createElement('option');
                            option.value = newLocation.trim();
                            option.textContent = newLocation.trim();

                            // Insert before custom option
                            locationSelect.insertBefore(option, customLocationOption);
                            locationSelect.value = newLocation.trim();
                        } else {
                            // Reset to previous value
                            locationSelect.value = item.location;
                        }
                    }
                });

                cell.appendChild(locationSelect);
                row.appendChild(cell);

                // Last updated field (not editable)
                cell = document.createElement('td');
                cell.textContent = item.lastUpdated;
                row.appendChild(cell);

                // Actions
                cell = document.createElement('td');
                cell.classList.add('action-buttons');

                // Edit button
                const editBtn = document.createElement('button');
                editBtn.classList.add('btn-icon');
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.setAttribute('title', 'Edit');
                editBtn.setAttribute('data-id', item.id);
                editBtn.addEventListener('click', () => {
                   startEdit(item.id);
                });

                // Delete button=
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('btn-icon');
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.setAttribute('title', 'Delete');
                deleteBtn.setAttribute('data-id', item.id);
                deleteBtn.addEventListener('click', () => {
                      deleteItem(item.id);
                });

                cell.appendChild(editBtn);
                cell.appendChild(deleteBtn);
                row.appendChild(cell);

                // Save button
                const saveBtn = document.createElement('button');
                saveBtn.classList.add('btn-icon');
                saveBtn.innerHTML = '<i class="fas fa-save"></i>';
                saveBtn.setAttribute('title', 'Save');
                saveBtn.setAttribute('data-id', item.id);
                saveBtn.addEventListener('click', () => {
                    saveEdit(item.id);
                });

                // Cancel button
                const cancelBtn = document.createElement('button');
                cancelBtn.classList.add('btn-icon');
                cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
                cancelBtn.setAttribute('title', 'Cancel');
                cancelBtn.addEventListener('click', () => {
                    cancelEdit();
                });

                cell.appendChild(saveBtn);
                cell.appendChild(cancelBtn);
                row.appendChild(cell);

                // Focus on first input after rendering
                setTimeout(() => {
                    document.getElementById(`edit-name-${item.id}`).focus();
                }, 100);

            } else {
                // View mode
                // Name
                let cell = document.createElement('td');
                cell.textContent = item.name;
                row.appendChild(cell);

                // Category
                cell = document.createElement('td');
                cell.textContent = item.category;
                row.appendChild(cell);

                // Quantity
                cell = document.createElement('td');
                if (item.quantity <= lowStockThreshold) {
                    cell.classList.add('low-stock-value');
                }
                cell.textContent = item.quantity;
                row.appendChild(cell);

                // Price
                cell = document.createElement('td');
                cell.textContent = InventoryUtils.formatCurrency(item.price);
                row.appendChild(cell);

                // Location
                cell = document.createElement('td');
                cell.textContent = item.location;
                row.appendChild(cell);

                // Last Updated
                cell = document.createElement('td');
                cell.textContent = item.lastUpdated;
                row.appendChild(cell);

                // Actions
                cell = document.createElement('td');
                cell.classList.add('action-buttons');

                // Edit button
                const editBtn = document.createElement('button');
                editBtn.classList.add('btn-icon');
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.setAttribute('title', 'Edit');
                editBtn.setAttribute('data-id', item.id);
                editBtn.addEventListener('click', () => {
                    startEdit(item.id);
                });

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('btn-icon');
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.setAttribute('title', 'Delete');
                deleteBtn.setAttribute('data-id', item.id);
                deleteBtn.addEventListener('click', () => {
                    deleteItem(item.id);
                });

                cell.appendChild(editBtn);
                cell.appendChild(deleteBtn);
                row.appendChild(cell);
            }

            tableBody.appendChild(row);
        });

        // Clear last updated item after rendering
        setTimeout(() => {
            lastUpdatedItem = null;
        }, 3000);
    };

    const startEdit = (itemId) => {
        // If already editing something else, save it first
        if (editingItemId !== null && editingItemId !== itemId) {
            const confirmChange = confirm('You are currently editing another item. Save changes?');
            if (confirmChange) {
                saveEdit(editingItemId);
            } else {
                cancelEdit();
            }
        }

        editingItemId = itemId;
        refreshInventory();
    };

    const saveEdit = (itemId) => {
        const nameInput = document.getElementById(`edit-name-${itemId}`);
        const categorySelect = document.getElementById(`edit-category-${itemId}`);
        const quantityInput = document.getElementById(`edit-quantity-${itemId}`);
        const priceInput = document.getElementById(`edit-price-${itemId}`);
        const locationSelect = document.getElementById(`edit-location-${itemId}`);

        // Basic validation
        if (!nameInput.value.trim()) {
            nameInput.classList.add('invalid-input');
            nameInput.focus();
            InventoryUtils.Toast.error('Please enter an item name');
            return;
        }

        const updatedItem = {
            id: itemId,
            name: nameInput.value.trim(),
            category: categorySelect.value,
            quantity: parseInt(quantityInput.value, 10) || 0,
            price: parseFloat(priceInput.value) || 0,
            location: locationSelect.value,
        };

        const success = InventoryData.updateItem(updatedItem);

        if (success) {
            lastUpdatedItem = itemId;
            editingItemId = null;
            refreshInventory();
            populateSelects(); // Update selects in case new categories/locations were added

            // Show success message
            InventoryUtils.Toast.success('Item updated successfully');
        } else {
            InventoryUtils.Toast.error('Error updating item');
        }
    };

    const cancelEdit = () => {
        editingItemId = null;
        refreshInventory();
    };

    const deleteItem = (itemId) => {
    console.log("Attempting to delete item with ID:", itemId, "Type:", typeof itemId);

    // Find the item to show in confirmation
    const item = InventoryData.getInventory().find(item => {
        console.log("Comparing with item:", item.id, "Type:", typeof item.id);
        return item.id === itemId;
    });

    if (!item) {
        console.log("Item not found!");
        return;
    }

    console.log("Found item to delete:", item);

    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        // Convert itemId to number to ensure type consistency
        const numericId = parseInt(itemId, 10);
        console.log("Calling InventoryData.deleteItem with:", numericId);

        const success = InventoryData.deleteItem(numericId);
        console.log("Deletion success:", success);

        if (success) {
            refreshInventory();
            InventoryUtils.Toast.success('Item deleted successfully');
            updateDashboardValues();
        } else {
            console.log("InventoryData.deleteItem returned false");
            InventoryUtils.Toast.error('Error deleting item');
        }
    }
};

    const refreshInventory = () => {
        const searchTerm = elements.searchInput.value.trim();
        const category = elements.categoryFilter.value;
        const location = elements.locationFilter.value;

        const filteredItems = InventoryData.searchInventory({
            searchTerm,
            category,
            location
        });

        renderInventoryTable(filteredItems);
    };

    const renderReports = () => {
        // Update total items
        elements.totalItems.textContent = InventoryUtils.formatNumber(InventoryData.getTotalItemCount());

        // Update total value
        elements.totalValue.textContent = InventoryUtils.formatCurrency(InventoryData.getTotalValue());

        // Update category breakdown
        const categoryData = InventoryData.getItemsByCategory();
        const categoryBreakdownHTML = Object.entries(categoryData)
            .map(([category, count]) => `
                <div class="breakdown-item">
                    <span>${category}</span>
                    <span class="font-semibold">${InventoryUtils.formatNumber(count)}</span>
                </div>
            `)
            .join('');

        elements.categoryBreakdown.innerHTML = categoryBreakdownHTML ||
            '<div class="no-data-message">No categories defined</div>';

        // Update low stock items
        const lowStockItems = InventoryData.getLowStockItems();
        elements.thresholdInput.value = InventoryData.getLowStockThreshold();

        let lowStockHTML = '';

        if (lowStockItems.length > 0) {
            lowStockHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lowStockItems.map(item => `
                            <tr class="low-stock">
                                <td>${item.name}</td>
                                <td>${item.category}</td>
                                <td class="low-stock-value">${item.quantity}</td>
                                <td>${item.location}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            lowStockHTML = '<p class="no-data-message">No items below threshold</p>';
        }

        elements.lowStockContainer.innerHTML = lowStockHTML;

        // Create charts
        createCharts();
    };

    const exportInventory = () => {
        try {
            const csvContent = InventoryData.exportToCSV();
            const fileName = `inventory_export_${InventoryUtils.getCurrentDate()}.csv`;

            // Use utility function to download
            InventoryUtils.downloadFile(csvContent, fileName, 'text/csv');

            // Show success message
            InventoryUtils.Toast.success('Inventory exported successfully');
        } catch (error) {
            console.error('Error exporting inventory:', error);
            InventoryUtils.Toast.error('Error exporting inventory');
        }
    };

    // Create charts for the reports view
    const createCharts = () => {
        // First check if Chart.js is available
        if (typeof Chart === 'undefined') {
            // Add Chart.js library dynamically
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
            script.onload = initCharts;
            document.head.appendChild(script);
        } else {
            initCharts();
        }
    };

    // Initialize charts after Chart.js is loaded
    const initCharts = () => {
        createCategoryDistributionChart();
        createValueTrendChart();
        createLowStockChart();
    };

    // Create category distribution chart
    const createCategoryDistributionChart = () => {
        // Get or create canvas element
        let canvas = document.getElementById('category-chart');
        if (!canvas) {
            // Find the category breakdown container
            const container = document.getElementById('category-breakdown');

            // Create a wrapper for the chart
            const chartWrapper = document.createElement('div');
            chartWrapper.classList.add('chart-wrapper');

            // Create canvas element
            canvas = document.createElement('canvas');
            canvas.id = 'category-chart';

            // Add canvas to wrapper and wrapper to container
            chartWrapper.appendChild(canvas);
            container.appendChild(chartWrapper);
        }

        // Get category data
        const categoryData = InventoryData.getItemsByCategory();
        const categories = Object.keys(categoryData);
        const quantities = Object.values(categoryData);

        // If no data, don't create chart
        if (categories.length === 0) {
            if (window.categoryChart) {
                window.categoryChart.destroy();
                window.categoryChart = null;
            }
            return;
        }

        // Generate colors
        const colors = categories.map((_, index) => {
            const hue = (index * 137) % 360; // Use golden angle for nice distribution
            return `hsl(${hue}, 70%, 60%)`;
        });

        // Create or update chart
        if (window.categoryChart) {
            window.categoryChart.data.labels = categories;
            window.categoryChart.data.datasets[0].data = quantities;
            window.categoryChart.data.datasets[0].backgroundColor = colors;
            window.categoryChart.update();
        } else {
            window.categoryChart = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: categories,
                    datasets: [{
                        data: quantities,
                        backgroundColor: colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                font: {
                                    family: 'var(--font-sans)',
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value} items (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    // Create value trend chart (mock data - would be replaced with real historical data)
    const createValueTrendChart = () => {
        // Get or create element for chart
        let valueChartContainer = document.getElementById('value-chart-container');
        if (!valueChartContainer) {
            // Create container and add it to the reports view
            valueChartContainer = document.createElement('div');
            valueChartContainer.id = 'value-chart-container';
            valueChartContainer.classList.add('report-card', 'full-width');

            const header = document.createElement('h3');
            header.textContent = 'Inventory Value Trend';
            valueChartContainer.appendChild(header);

            const chartWrapper = document.createElement('div');
            chartWrapper.classList.add('chart-wrapper');
            valueChartContainer.appendChild(chartWrapper);

            const canvas = document.createElement('canvas');
            canvas.id = 'value-chart';
            chartWrapper.appendChild(canvas);

            // Find reports grid and append the new container
            const reportsGrid = document.querySelector('#reports-view .reports-grid');
            reportsGrid.appendChild(valueChartContainer);
        }

        // Create mock data for demonstration
        // In a real app, this would come from historical data stored in the database
        const today = new Date();
        const labels = [];
        const data = [];

        // Generate labels for the last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

            // Generate realistic-looking mock data
            // Start with the current total value and randomize history a bit
            const currentValue = InventoryData.getTotalValue();
            // Add some randomness to simulate historical changes
            const randomFactor = 0.95 + (Math.random() * 0.1); // Random between 0.95 and 1.05
            data.push((currentValue * randomFactor * (1 - (i / 100))).toFixed(2));
        }

        // Get canvas
        const canvas = document.getElementById('value-chart');

        // Create or update chart
        if (window.valueChart) {
            window.valueChart.data.labels = labels;
            window.valueChart.data.datasets[0].data = data;
            window.valueChart.update();
        } else {
            window.valueChart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Inventory Value',
                        data: data,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => `Value: ${InventoryUtils.formatCurrency(context.raw)}`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: (value) => InventoryUtils.formatCurrency(value)
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    };

    // Create low stock chart
    const createLowStockChart = () => {
        // Get or create element for chart
        let container = document.getElementById('low-stock-chart-container');
        if (!container) {
            // Create container for low stock chart
            container = document.createElement('div');
            container.id = 'low-stock-chart-container';
            container.classList.add('report-card');
            container.style.gridColumn = 'span 2';

            const header = document.createElement('h3');
            header.textContent = 'Low Stock Items';
            container.appendChild(header);

            const chartWrapper = document.createElement('div');
            chartWrapper.classList.add('chart-wrapper');
            container.appendChild(chartWrapper);

            const canvas = document.createElement('canvas');
            canvas.id = 'low-stock-chart';
            chartWrapper.appendChild(canvas);

            // Find reports grid and append after the value chart
            const valueChartContainer = document.getElementById('value-chart-container');
            if (valueChartContainer && valueChartContainer.parentNode) {
                valueChartContainer.parentNode.insertBefore(container, valueChartContainer.nextSibling);
            } else {
                // Fallback if value chart container doesn't exist
                const reportsGrid = document.querySelector('#reports-view .reports-grid');
                reportsGrid.appendChild(container);
            }
        }

        // Get low stock items
        const lowStockItems = InventoryData.getLowStockItems();

        // If no low stock items, show message
        if (lowStockItems.length === 0) {
            const chartWrapper = container.querySelector('.chart-wrapper');
            chartWrapper.innerHTML = '<div class="no-data-message">No items below threshold</div>';

            if (window.lowStockChart) {
                window.lowStockChart.destroy();
                window.lowStockChart = null;
            }

            return;
        }

        // Prepare data
        const labels = lowStockItems.map(item => item.name);
        const quantities = lowStockItems.map(item => item.quantity);
        const threshold = InventoryData.getLowStockThreshold();
        const thresholdLine = Array(labels.length).fill(threshold);

        // Generate colors - red for items below 50% of threshold, orange otherwise
        const colors = quantities.map(qty =>
            qty < (threshold * 0.5) ? 'rgba(239, 68, 68, 0.7)' : 'rgba(245, 158, 11, 0.7)'
        );

        const borderColors = quantities.map(qty =>
            qty < (threshold * 0.5) ? 'rgb(220, 38, 38)' : 'rgb(217, 119, 6)'
        );

        // Get canvas
        const canvas = document.getElementById('low-stock-chart');

        // Create or update chart
        if (window.lowStockChart) {
            window.lowStockChart.data.labels = labels;
            window.lowStockChart.data.datasets[0].data = quantities;
            window.lowStockChart.data.datasets[0].backgroundColor = colors;
            window.lowStockChart.data.datasets[0].borderColor = borderColors;
            window.lowStockChart.data.datasets[1].data = thresholdLine;
            window.lowStockChart.update();
        } else {
            window.lowStockChart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Current Quantity',
                            data: quantities,
                            backgroundColor: colors,
                            borderColor: borderColors,
                            borderWidth: 1
                        },
                        {
                            label: 'Threshold',
                            data: thresholdLine,
                            type: 'line',
                            borderColor: 'rgba(107, 114, 128, 0.7)',
                            borderDash: [5, 5],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: threshold * 1.5 // Set max to 150% of threshold
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            });
        }
    };

    // Helper function to update all charts
    const updateCharts = () => {
        if (typeof Chart !== 'undefined') {
            createCategoryDistributionChart();
            createValueTrendChart();
            createLowStockChart();
        }
    };

    // Function to create inventory status dashboard
    const createStatusDashboard = () => {
        // Create dashboard container if it doesn't exist
        let dashboardContainer = document.getElementById('inventory-dashboard');
        if (!dashboardContainer) {
            dashboardContainer = document.createElement('div');
            dashboardContainer.id = 'inventory-dashboard';
            dashboardContainer.className = 'dashboard-container';

            // Create dashboard cards
            const cards = [
                {
                    title: 'Total Items',
                    value: InventoryUtils.formatNumber(InventoryData.getTotalItemCount()),
                    icon: 'fas fa-boxes',
                    color: 'var(--primary-600)'
                },
                {
                    title: 'Total Value',
                    value: InventoryUtils.formatCurrency(InventoryData.getTotalValue()),
                    icon: 'fas fa-dollar-sign',
                    color: 'var(--success-600)'
                },
                {
                    title: 'Categories',
                    value: InventoryData.getCategories().length,
                    icon: 'fas fa-tags',
                    color: 'var(--info-600)'
                },
                {
                    title: 'Low Stock',
                    value: InventoryData.getLowStockItems().length,
                    icon: 'fas fa-exclamation-triangle',
                    color: 'var(--warning-600)'
                }
            ];

            // Add cards to dashboard
            cards.forEach(card => {
                const cardEl = document.createElement('div');
                cardEl.className = 'dashboard-card';

                // Card icon
                const iconEl = document.createElement('div');
                iconEl.className = 'dashboard-icon';
                iconEl.style.backgroundColor = card.color + '20'; // 20% opacity
                iconEl.style.color = card.color;
                iconEl.innerHTML = `<i class="${card.icon}"></i>`;

                // Card content
                const contentEl = document.createElement('div');
                contentEl.className = 'dashboard-content';

                const titleEl = document.createElement('div');
                titleEl.className = 'dashboard-title';
                titleEl.textContent = card.title;

                const valueEl = document.createElement('div');
                valueEl.className = 'dashboard-value';
                valueEl.textContent = card.value;

                contentEl.appendChild(titleEl);
                contentEl.appendChild(valueEl);

                cardEl.appendChild(iconEl);
                cardEl.appendChild(contentEl);
                dashboardContainer.appendChild(cardEl);
            });

            // Insert dashboard at the top of inventory view
            const inventoryView = document.getElementById('inventory-view');
            inventoryView.insertBefore(dashboardContainer, inventoryView.firstChild);
        }

        // Update dashboard values
        updateDashboardValues();
    };

    // Update dashboard values
    const updateDashboardValues = () => {
        const dashboard = document.getElementById('inventory-dashboard');
        if (!dashboard) return;

        const valueElements = dashboard.querySelectorAll('.dashboard-value');
        if (valueElements.length >= 4) {
            valueElements[0].textContent = InventoryUtils.formatNumber(InventoryData.getTotalItemCount());
            valueElements[1].textContent = InventoryUtils.formatCurrency(InventoryData.getTotalValue());
            valueElements[2].textContent = InventoryData.getCategories().length;
            valueElements[3].textContent = InventoryData.getLowStockItems().length;
        }
    };

    // Initialize autosave feature
    const initAutoSave = () => {
        // Listen for form input changes and save automatically
        const formInputs = elements.addItemForm.querySelectorAll('input, select');

        formInputs.forEach(input => {
            input.addEventListener('change', () => {
                // Store the current form state in localStorage
                const formData = {
                    name: elements.itemName.value,
                    category: elements.itemCategory.value,
                    quantity: elements.itemQuantity.value,
                    price: elements.itemPrice.value,
                    location: elements.itemLocation.value
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
                elements.itemName.value = formData.name || '';
                elements.itemCategory.value = formData.category || '';
                elements.itemQuantity.value = formData.quantity || 0;
                elements.itemPrice.value = formData.price || 0;
                elements.itemLocation.value = formData.location || '';
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
                exportInventory();
            }

            // Ctrl/Cmd + F for search focus
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                elements.searchInput.focus();
            }

            // Ctrl/Cmd + N for new item
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                toggleAddItemForm(true);
            }

            // Escape to close form
            if (e.key === 'Escape') {
                if (!elements.addItemForm.classList.contains('hidden')) {
                    toggleAddItemForm(false);
                } else if (editingItemId !== null) {
                    cancelEdit();
                }
            }

            // Show help modal with F1 or ?
            if (e.key === 'F1' || (e.shiftKey && e.key === '?')) {
                e.preventDefault();
                showHelpModal();
            }
        });
    };

    // Show help modal with keyboard shortcuts and app info
    const showHelpModal = () => {
        // Create modal if it doesn't exist
        let helpModal = document.getElementById('help-modal');

        if (!helpModal) {
            helpModal = document.createElement('div');
            helpModal.id = 'help-modal';
            helpModal.style.position = 'fixed';
            helpModal.style.top = '0';
            helpModal.style.left = '0';
            helpModal.style.right = '0';
            helpModal.style.bottom = '0';
            helpModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            helpModal.style.display = 'flex';
            helpModal.style.alignItems = 'center';
            helpModal.style.justifyContent = 'center';
            helpModal.style.zIndex = '9999';

            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.borderRadius = 'var(--radius-lg)';
            modalContent.style.padding = '2rem';
            modalContent.style.maxWidth = '500px';
            modalContent.style.boxShadow = 'var(--shadow-lg)';

            // Dark mode compatibility
            document.documentElement.classList.contains('dark-mode') && (
                modalContent.style.backgroundColor = 'var(--dark-card-bg)',
                modalContent.style.color = 'var(--text-color)'
            );

            modalContent.innerHTML = `
                <h2 style="margin-top: 0; font-size: 1.5rem; font-weight: 600;">Keyboard Shortcuts</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                    <tr>
                        <td style="padding: 0.5rem; border-bottom: 1px solid var(--neutral-200);"><kbd>Ctrl/⌘ + N</kbd></td>
                        <td style="padding: 0.5rem; border-bottom: 1px solid var(--neutral-200);">Add new item</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; border-bottom: 1px solid var(--neutral-200);"><kbd>Ctrl/⌘ + S</kbd></td>
                        <td style="padding: 0.5rem; border-bottom: 1px solid var(--neutral-200);">Export inventory</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; border-bottom: 1px solid var(--neutral-200);"><kbd>Ctrl/⌘ + F</kbd></td>
                        <td style="padding: 0.5rem; border-bottom: 1px solid var(--neutral-200);">Focus search</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; border-bottom: 1px solid var(--neutral-200);"><kbd>Esc</kbd></td>
                        <td style="padding: 0.5rem; border-bottom: 1px solid var(--neutral-200);">Close form / Cancel edit</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem;"><kbd>F1</kbd> or <kbd>Shift + ?</kbd></td>
                        <td style="padding: 0.5rem;">Show this help</td>
                    </tr>
                </table>
                
                <h2 style="font-size: 1.25rem; font-weight: 600;">About</h2>
                <p>Inventory Management System v1.0</p>
                <p>A modern, responsive inventory management application with data visualization and reports.</p>
                
                <div style="text-align: right; margin-top: 1.5rem;">
                    <button id="close-help-btn" style="padding: 0.5rem 1rem; background-color: var(--neutral-200); border: none; border-radius: var(--radius); cursor: pointer; font-weight: 500;">Close</button>
                </div>
            `;

            helpModal.appendChild(modalContent);
            document.body.appendChild(helpModal);

            // Close on button click
            document.getElementById('close-help-btn').addEventListener('click', () => {
                helpModal.remove();
            });

            // Close on click outside
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    helpModal.remove();
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && document.body.contains(helpModal)) {
                    helpModal.remove();
                }
            });
        }
    };

    // Implement responsive behavior
    const initResponsiveFeatures = () => {
        const handleResize = () => {
            const isMobile = InventoryUtils.isMobileDevice() || window.innerWidth < 768;
            document.body.classList.toggle('mobile-view', isMobile);

            // Adjust table for mobile view
            const table = elements.inventoryTable;
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

    // Import from CSV
    const importFromCSV = async (file) => {
        try {
            // Read the file
            const reader = new FileReader();

            reader.onload = (e) => {
                const csvContent = e.target.result;

                // Parse CSV data
                const result = processCSVImport(csvContent);

                if (result) {
                    // Update UI
                    refreshInventory();
                    populateSelects();
                    updateDashboardValues();

                    // Success notification
                    InventoryUtils.Toast.success(`Imported ${result.count} items successfully`);
                }
            };

            reader.readAsText(file);
        } catch (error) {
            console.error('Error importing from CSV:', error);
            InventoryUtils.Toast.error('Error importing from CSV');
        }
    };

    // Process CSV import
    const processCSVImport = (csvContent) => {
        try {
            // Use CSV utility to parse data
            const parsedData = InventoryUtils.CSV.CSVToObjects(csvContent);

            if (!parsedData || parsedData.length === 0) {
                InventoryUtils.Toast.error('No valid data found in CSV file');
                return null;
            }

            // Check if CSV has the expected format
            const requiredFields = ['name', 'category', 'quantity', 'price', 'location'];
            const hasValidHeaders = requiredFields.every(field =>
                Object.keys(parsedData[0]).some(header =>
                    header.toLowerCase() === field.toLowerCase()
                )
            );

            if (!hasValidHeaders) {
                InventoryUtils.Toast.error('Invalid CSV format. Missing required fields.');
                return null;
            }

            // Process data
            let importCount = 0;

            parsedData.forEach(row => {
                // Map CSV fields to our data model
                const item = {
                    name: row.name || row.Name || '',
                    category: row.category || row.Category || '',
                    quantity: parseInt(row.quantity || row.Quantity, 10) || 0,
                    price: parseFloat(row.price || row.Price) || 0,
                    location: row.location || row.Location || ''
                };

                // Validate required fields
                if (!item.name || !item.category || !item.location) {
                    return; // Skip invalid rows
                }

                // Add to inventory
                InventoryData.addItem(item);
                importCount++;
            });

            return { count: importCount };
        } catch (error) {
            console.error('Error processing CSV import:', error);
            InventoryUtils.Toast.error('Error processing CSV file');
            return null;
        }
    };

    // Add import button
    const addImportButton = () => {
        // Create import button
        const importBtn = document.createElement('button');
        importBtn.id = 'import-btn';
        importBtn.className = 'btn btn-secondary';
        importBtn.innerHTML = '<i class="fas fa-upload"></i> Import';
        importBtn.style.marginRight = 'var(--spacing-md)';

        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';
        fileInput.id = 'csv-file-input';

        // Add file input change handler
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importFromCSV(e.target.files[0]);
                // Clear file input
                fileInput.value = '';
            }
        });

        // Add click handler to import button
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // Add to DOM
        const addItemContainer = document.querySelector('.add-item-container');
        addItemContainer.prepend(fileInput);
        addItemContainer.prepend(importBtn);
    };

    // Public methods
    return {
        /**
         * Initialize the UI module
         */
        init() {
            // First, bind all event listeners

            // Tab navigation
            elements.inventoryTab.addEventListener('click', () => showView('inventory'));
            elements.reportsTab.addEventListener('click', () => showView('reports'));
            elements.exportBtn.addEventListener('click', exportInventory);

            // Search and filters
            elements.searchInput.addEventListener('input', () => {
                refreshInventory();
            });

            elements.categoryFilter.addEventListener('change', refreshInventory);
            elements.locationFilter.addEventListener('change', refreshInventory);

            // Add item form
            elements.addItemBtn.addEventListener('click', () => toggleAddItemForm(true));
            elements.closeFormBtn.addEventListener('click', () => toggleAddItemForm(false));
            elements.submitItemBtn.addEventListener('click', () => {
                if (validateForm()) {
                    const newItem = getFormValues();
                    const addedItem = InventoryData.addItem(newItem);

                    if (addedItem) {
                        lastUpdatedItem = addedItem.id;
                        toggleAddItemForm(false);
                        refreshInventory();
                        populateSelects(); // Update selects in case new categories/locations were added

                        // Update dashboard if it exists
                        updateDashboardValues();

                        // Show success message
                        InventoryUtils.Toast.success('Item added successfully');
                    } else {
                        InventoryUtils.Toast.error('Error adding item');
                    }
                }
            });

            // Threshold input
            if (elements.thresholdInput) {
                elements.thresholdInput.addEventListener('change', () => {
                    InventoryData.setLowStockThreshold(elements.thresholdInput.value);
                    renderReports();
                });
            }

            // Initialize additional features
            initAutoSave();
            initKeyboardShortcuts();
            initResponsiveFeatures();

            // Add import button
            addImportButton();

            // Now populate selects with data
            populateSelects();

            // Create dashboard
            createStatusDashboard();

            // Initial render of inventory
            refreshInventory();

            // Initial view setup
            showView('inventory');
        }
    };
})();