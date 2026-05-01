const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', () => callback()),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', () => callback()),
    installUpdate: () => ipcRenderer.send('install-update')
});
