const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Voz - Generador de Voz con IA',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Ocultar el menú superior (Archivo, Edición, etc.)
  mainWindow.setMenuBarVisibility(false);

  // Cargar el archivo principal de la app
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Iniciar el chequeo de actualizaciones después de que se crea la ventana
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Eventos de auto-actualización
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Actualización Disponible',
    message: 'Una nueva versión de Voz ha sido detectada y está siendo descargada en segundo plano.',
    buttons: ['Entendido']
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Actualización Lista',
    message: 'La actualización se ha descargado. La aplicación se reiniciará para aplicar los cambios.',
    buttons: ['Reiniciar y Actualizar']
  }).then(() => {
    autoUpdater.quitAndInstall();
  });
});

autoUpdater.on('error', (err) => {
  console.log('Error en auto-updater:', err);
});
