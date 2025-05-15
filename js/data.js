/**
 * data.js
 * Handles all data operations: storage, retrieval, filtering, and manipulations.
 */

// Application data model
const InventoryData = (() => {
    // Private variables
    let inventory = [];
    let categories = [];
    let locations = [];
    let lowStockThreshold = 30;

    // Initial sample data
    const sampleInventory = [
        { id: 1, name: 'Widget A', category: 'Electronics', quantity: 150, price: 29.99, location: 'Warehouse A', lastUpdated: '2025-04-20' },
        { id: 2, name: 'Component B', category: 'Parts', quantity: 432, price: 12.50, location: 'Warehouse B', lastUpdated: '2025-04-22' },
        { id: 3, name: 'Tool Set C', category: 'Equipment', quantity: 28, price: 149.99, location: 'Warehouse A', lastUpdated: '2025-04-23' },
        { id: 4, name: 'Material D', category: 'Raw Materials', quantity: 1250, price: 3.75, location: 'Warehouse C', lastUpdated: '2025-04-19' },
        { id: 5, name: 'Product E', category: 'Finished Goods', quantity: 75, price: 89.99, location: 'Warehouse B', lastUpdated: '2025-04-24' },
    ];

    const sampleCategories = ['Electronics', 'Parts', 'Equipment', 'Raw Materials', 'Finished Goods'];
    const sampleLocations = ['Warehouse A', 'Warehouse B', 'Warehouse C'];

    // Private methods
    const saveToLocalStorage = () => {
        try {
            localStorage.setItem('inventory', JSON.stringify(inventory));
            localStorage.setItem('categories', JSON.stringify(categories));
            localStorage.setItem('locations', JSON.stringify(locations));
            localStorage.setItem('lowStockThreshold', lowStockThreshold.toString());
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    };

    const loadFromLocalStorage = () => {
        try {
            const storedInventory = localStorage.getItem('inventory');
            const storedCategories = localStorage.getItem('categories');
            const storedLocations = localStorage.getItem('locations');
            const storedThreshold = localStorage.getItem('lowStockThreshold');

            if (storedInventory) {
                inventory = JSON.parse(storedInventory);
            } else {
                inventory = [...sampleInventory];
            }

            if (storedCategories) {
                categories = JSON.parse(storedCategories);
            } else {
                categories = [...sampleCategories];
            }

            if (storedLocations) {
                locations = JSON.parse(storedLocations);
            } else {
                locations = [...sampleLocations];
            }

            if (storedThreshold) {
                lowStockThreshold = parseInt(storedThreshold, 10);
            }

            return true;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            // Fall back to sample data
            inventory = [...sampleInventory];
            categories = [...sampleCategories];
            locations = [...sampleLocations];
            return false;
        }
    };

    const generateId = () => {
        if (inventory.length === 0) return 1;
        return Math.max(...inventory.map(item => item.id)) + 1;
    };

    // Public methods
    return {
        /**
         * Initialize the data module
         */
        init() {
            loadFromLocalStorage();
        },

        /**
         * Get the entire inventory
         * @returns {Array} The inventory
         */
        getInventory() {
            return [...inventory];
        },

        /**
         * Get all categories
         * @returns {Array} The categories
         */
        getCategories() {
            return [...categories];
        },

        /**
         * Get all locations
         * @returns {Array} The locations
         */
        getLocations() {
            return [...locations];
        },

        /**
         * Get the low stock threshold
         * @returns {Number} The threshold
         */
        getLowStockThreshold() {
            return lowStockThreshold;
        },

        /**
         * Set the low stock threshold
         * @param {Number} value - The new threshold
         */
        setLowStockThreshold(value) {
            lowStockThreshold = parseInt(value, 10) || 0;
            saveToLocalStorage();
        },

        /**
         * Add a new item to inventory
         * @param {Object} item - The item to add
         * @returns {Object} The added item with ID
         */
        addItem(item) {
            const newItem = {
                ...item,
                id: generateId(),
                lastUpdated: new Date().toISOString().slice(0, 10)
            };

            inventory.push(newItem);

            // Add new category if it doesn't exist
            if (item.category && !categories.includes(item.category)) {
                categories.push(item.category);
            }

            // Add new location if it doesn't exist
            if (item.location && !locations.includes(item.location)) {
                locations.push(item.location);
            }

            saveToLocalStorage();
            return newItem;
        },

        /**
         * Update an existing item
         * @param {Object} updatedItem - The item with updates
         * @returns {Boolean} Success status
         */
        updateItem(updatedItem) {
            const index = inventory.findIndex(item => item.id === updatedItem.id);

            if (index === -1) return false;

            // Update the item with current date
            updatedItem.lastUpdated = new Date().toISOString().slice(0, 10);
            inventory[index] = updatedItem;

            // Add new category if it doesn't exist
            if (updatedItem.category && !categories.includes(updatedItem.category)) {
                categories.push(updatedItem.category);
            }

            // Add new location if it doesn't exist
            if (updatedItem.location && !locations.includes(updatedItem.location)) {
                locations.push(updatedItem.location);
            }

            saveToLocalStorage();
            return true;
        },

        /**
         * Delete an item from inventory
         * @param {Number} id - ID of the item to delete
         * @returns {Boolean} Success status
         */
        deleteItem(id) {
    console.log("data.js deleteItem called with ID:", id, "Type:", typeof id);
    console.log("Current inventory:", inventory);

    const initialLength = inventory.length;

    // Convert to number to ensure type consistency
    const numericId = parseInt(id, 10);
    console.log("Using numeric ID:", numericId);

    // Show what we're comparing against
    inventory.forEach(item => {
        console.log(`Item ID: ${item.id} (${typeof item.id}) === ${numericId} (${typeof numericId})? ${item.id === numericId}`);
    });

    inventory = inventory.filter(item => parseInt(item.id, 10) !== numericId);

    const success = initialLength > inventory.length;
    console.log("Deletion success:", success, "New length:", inventory.length);

    if (success) {
        saveToLocalStorage();
    }

    return success;
},

        /**
         * Search and filter inventory
         * @param {Object} filters - The filters to apply
         * @returns {Array} Filtered inventory
         */
        searchInventory(filters = {}) {
            const { searchTerm, category, location } = filters;

            return inventory.filter(item => {
                // Apply search term filter
                if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    !item.category.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return false;
                }

                // Apply category filter
                if (category && item.category !== category) {
                    return false;
                }

                // Apply location filter
                if (location && item.location !== location) {
                    return false;
                }

                return true;
            });
        },

        /**
         * Get items with quantity below threshold
         * @returns {Array} Low stock items
         */
        getLowStockItems() {
            return inventory.filter(item => item.quantity <= lowStockThreshold);
        },

        /**
         * Get the total count of items in inventory
         * @returns {Number} Total quantity
         */
        getTotalItemCount() {
            return inventory.reduce((sum, item) => sum + item.quantity, 0);
        },

        /**
         * Get the total value of inventory
         * @returns {Number} Total value
         */
        getTotalValue() {
            return inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        },

        /**
         * Get item counts by category
         * @returns {Object} Category counts
         */
        getItemsByCategory() {
            const result = {};

            categories.forEach(category => {
                result[category] = inventory
                    .filter(item => item.category === category)
                    .reduce((sum, item) => sum + item.quantity, 0);
            });

            return result;
        },

        /**
         * Export inventory to CSV
         * @returns {String} CSV data
         */
        exportToCSV() {
            const headers = ['ID', 'Name', 'Category', 'Quantity', 'Price', 'Location', 'Last Updated'];

            const rows = inventory.map(item => [
                item.id,
                item.name,
                item.category,
                item.quantity,
                item.price,
                item.location,
                item.lastUpdated
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            return csvContent;
        },

        /**
         * Reset to sample data (for testing)
         */
        resetToSampleData() {
            inventory = [...sampleInventory];
            categories = [...sampleCategories];
            locations = [...sampleLocations];
            saveToLocalStorage();
        }
    };
})();