const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    // File operations
    exportFile: (data, defaultPath) =>
      ipcRenderer.invoke('save-file', data, defaultPath),

    importFile: () =>
      ipcRenderer.invoke('open-file'),

    // Application data persistence
    saveAppData: (data) =>
      ipcRenderer.invoke('save-data', data),

    loadAppData: () =>
      ipcRenderer.invoke('load-data'),

    // Event listeners
    onMenuExport: (callback) => {
      ipcRenderer.on('menu-export', () => callback());
      return () => {
        ipcRenderer.removeAllListeners('menu-export');
      };
    },

    onMenuImport: (callback) => {
      ipcRenderer.on('menu-import', () => callback());
      return () => {
        ipcRenderer.removeAllListeners('menu-import');
      };
    }
  }
);