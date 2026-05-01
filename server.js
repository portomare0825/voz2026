#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`Solicitud: ${req.method} ${req.url}`);
    
    // Manejar ruta raíz
    let filePath = req.url === '/' ? './index.html' : '.' + req.url;
    
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                console.error(`Archivo no encontrado: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                console.error('Error del servidor:', error);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Error del servidor</h1>', 'utf-8');
            }
        } else {
            console.log(`Sirviendo: ${filePath} (${contentType})`);
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('\n==========================================');
    console.log('🎙️  Servidor Voz TTS iniciado');
    console.log('==========================================');
    console.log(`\n🌐 URL: http://localhost:${PORT}`);
    console.log(`📂 Directorio: ${__dirname}\n`);
    console.log('Presiona Ctrl+C para detener el servidor\n');
});

server.on('error', (error) => {
    console.error('Error del servidor:', error);
});