/**
 * electron-integration.js
 * Integrates the web application with Electron desktop features.
 * Include this script in your HTML after all other application scripts.
 */

// Check if we're running in Electron
const isElectron = () => {
  return window.electron !== undefined;
};

// Initialize Electron integration
const ElectronIntegration = (() => {
  // Only run if we're in Electron
  if (!isElectron()) {
    console.log('Running in browser mode - Electron features disabled');
    return {
      init: () => {}
    };
  }

  // Set up event listeners for menu actions
  const setupEventListeners = () => {
    // Handle export menu command
    const exportCleanup = window.electron.onMenuExport(() => {
      console.log('Export menu command received');
      const csvContent = InventoryData.exportToCSV();
      const defaultFilename = `inventory_export_${InventoryUtils.getCurrentDate()}.csv`;

      window.electron.exportFile(csvContent, defaultFilename)
        .then(filePath => {
          if (filePath) {
            InventoryUtils.Toast.success(`Inventory exported to ${filePath}`);
          }
        })
        .catch(error => {
          console.error('Export failed:', error);
          InventoryUtils.Toast.error('Export failed');
        });
    });

    // Handle import menu command
    const importCleanup = window.electron.onMenuImport(() => {
      console.log('Import menu command received');

      window.electron.importFile()
        .then(result => {
          if (result && result.data) {
            // Process the CSV data
            const importResult = processCSVImport(result.data);
            if (importResult && importResult.count > 0) {
              InventoryUtils.Toast.success(`Imported ${importResult.count} items successfully`);
              // Refresh UI
              InventoryUI.refreshInventory();
              InventoryUI.populateSelects();
              InventoryUI.updateDashboardValues();
            }
          }
        })
        .catch(error => {
          console.error('Import failed:', error);
          InventoryUtils.Toast.error('Import failed');
        });
    });

    // Return a cleanup function
    return () => {
      exportCleanup();
      importCleanup();
    };
  };

  // Process CSV import (reusing the existing function from ui.js)
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

  // Save application data to the filesystem
  const saveAppData = async () => {
    if (!isElectron()) return;

    const data = {
      inventory: InventoryData.getInventory(),
      categories: InventoryData.getCategories(),
      locations: InventoryData.getLocations(),
      lowStockThreshold: InventoryData.getLowStockThreshold()
    };

    try {
  await window.electron.saveAppData(data);
  console.log('Data saved to filesystem');

  // Only call these functions if they exist
  if (InventoryUI && typeof InventoryUI.refreshInventory === 'function') {
    InventoryUI.refreshInventory();
  }
  if (InventoryUI && typeof InventoryUI.populateSelects === 'function') {
    InventoryUI.populateSelects();
  }
  if (InventoryUI && typeof InventoryUI.updateDashboardValues === 'function') {
    InventoryUI.updateDashboardValues();
  }

  return true;
} catch (error) {
  console.error('Error saving data to filesystem:', error);
  return false;
}
  };

  // Load application data from the filesystem
  const loadAppData = async () => {
    if (!isElectron()) return;

    try {
      const data = await window.electron.loadAppData();

      if (data) {
        console.log('Data loaded from filesystem');

        // Update the application state with loaded data
        if (data.inventory && Array.isArray(data.inventory)) {
          data.inventory.forEach(item => {
            InventoryData.updateItem(item);
          });
        }

        // Refresh UI
        InventoryUI.refreshInventory();
        InventoryUI.populateSelects();
        InventoryUI.updateDashboardValues();

        return true;
      }
    } catch (error) {
      console.error('Error loading data from filesystem:', error);
    }

    return false;
  };

  // Override localStorage with filesystem-backed storage
  const setupPersistence = () => {
    // Load data on startup
    loadAppData();

    // Save data periodically (every 60 seconds)
    setInterval(saveAppData, 60000);

    // Save on window close
    window.addEventListener('beforeunload', () => {
      saveAppData();
    });

    // Hook into existing data change events
    const originalAddItem = InventoryData.addItem;
    InventoryData.addItem = function(item) {
      const result = originalAddItem.call(this, item);
      saveAppData();
      return result;
    };

    const originalUpdateItem = InventoryData.updateItem;
    InventoryData.updateItem = function(item) {
      const result = originalUpdateItem.call(this, item);
      saveAppData();
      return result;
    };

    const originalDeleteItem = InventoryData.deleteItem;
    InventoryData.deleteItem = function(id) {
      const result = originalDeleteItem.call(this, id);
      saveAppData();
      return result;
    };

    const originalSetThreshold = InventoryData.setLowStockThreshold;
    InventoryData.setLowStockThreshold = function(value) {
      const result = originalSetThreshold.call(this, value);
      saveAppData();
      return result;
    };
  };

  // Add desktop-specific UI enhancements
  const enhanceUI = () => {
    // Add "Running in Desktop Mode" indicator
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      const desktopMode = document.createElement('div');
      desktopMode.style.position = 'fixed';
      desktopMode.style.bottom = '10px';
      desktopMode.style.left = '10px';
      desktopMode.style.background = 'rgba(59, 130, 246, 0.1)';
      desktopMode.style.color = 'rgb(37, 99, 235)';
      desktopMode.style.padding = '5px 10px';
      desktopMode.style.borderRadius = '4px';
      desktopMode.style.fontSize = '12px';
      desktopMode.style.zIndex = '1000';
      desktopMode.textContent = 'Desktop Mode';

      appContainer.appendChild(desktopMode);
    }
  };

  // Public methods
  return {
    init() {
      console.log('Initializing Electron integration');
      setupEventListeners();
      setupPersistence();
      enhanceUI();
    }
  };
})();

// Initialize Electron integration when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize after the main app
  setTimeout(() => {
    ElectronIntegration.init();
  }, 500);
});