@echo off
setlocal
cd /d "%~dp0"

if not exist "package.json" (
    echo Error: no se encuentra package.json. Este script debe estar en la raiz del proyecto carta-astral-app.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo Error: npm no esta en el PATH. Instala Node.js ^(18+^) desde https://nodejs.org/ y vuelve a abrir la consola.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo Falta la carpeta node_modules. Ejecuta primero: npm install
    pause
    exit /b 1
)

call npm run dev
set EXIT=%ERRORLEVEL%
if %EXIT% neq 0 (
    echo.
    echo La aplicacion termino con error ^(codigo %EXIT%^).
    pause
)
exit /b %EXIT%
