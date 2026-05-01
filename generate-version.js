const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

const date = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

const versionInfo = {
    version: pkg.version,
    date: date
};

const versionStr = `v${pkg.version} - Actualizado el ${date}`;

// Guardar version.json por compatibilidad
fs.writeFileSync(
    path.join(__dirname, 'version.json'), 
    JSON.stringify(versionInfo, null, 2)
);

// Inyectar directamente en index.html para que NUNCA falle
const indexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    // Reemplazar el contenido del párrafo de la versión
    html = html.replace(/<p class="app-version-info" id="appVersionInfo">.*?<\/p>/, `<p class="app-version-info" id="appVersionInfo">${versionStr}</p>`);
    fs.writeFileSync(indexPath, html);
}

console.log(`Versión inyectada: ${versionStr}`);
