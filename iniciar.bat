@echo off
echo ========================================
echo    Iniciando Servidor Voz TTS
echo ========================================
echo.
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js no esta instalado
    echo.
    echo Por favor, instala Node.js desde:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado
echo.
echo Iniciando servidor en http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

cd /d "%~dp0"
node server.js

pause