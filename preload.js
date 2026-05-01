const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', () => callback()),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (_event, percent) => callback(percent)),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', () => callback()),
    installUpdate: () => ipcRenderer.send('install-update')
});
