const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

// Leer .env.local
let envConfig = {};
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  // Eliminar BOM si existe
  if (envContent.charCodeAt(0) === 0xFEFF) {
    envContent = envContent.slice(1);
  }
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([^=]+?)\s*=\s*(.*)\s*$/);
    if (match) {
      // Eliminar comillas si las hay
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
      }
      envConfig[match[1].trim()] = val;
    }
  });
  console.log("Cargado .env.local, claves:", Object.keys(envConfig));
}
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Voz - Generador de Voz con IA',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Desactivar aceleración de hardware para evitar crashes de GPU en algunas computadoras
app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Eventos de auto-actualización (Enviamos a la interfaz)
autoUpdater.on('update-available', () => {
  if (mainWindow) mainWindow.webContents.send('update-available');
});

autoUpdater.on('download-progress', (progressObj) => {
  if (mainWindow) mainWindow.webContents.send('download-progress', progressObj.percent);
});

autoUpdater.on('update-downloaded', () => {
  if (mainWindow) mainWindow.webContents.send('update-downloaded');
});

// Recibir orden de instalar
ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (err) => {
  console.log('Error en auto-updater:', err);
});

// Exponer variables de entorno
ipcMain.handle('get-env', () => {
  return envConfig;
});
