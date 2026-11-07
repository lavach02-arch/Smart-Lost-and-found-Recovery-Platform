@echo off
title SmartFind Platform Launcher
echo ===================================================
echo Starting SmartFind Lost and Found Platform...
echo ===================================================

set "PATH=C:\Users\SUBHASHINI\.gemini\antigravity\scratch\nodejs;%PATH%"

echo [1/2] Launching Backend Server (Port 5000)...
start "SmartFind Backend" cmd /k "title SmartFind Backend && cd /d "%~dp0backend" && set "PATH=C:\Users\SUBHASHINI\.gemini\antigravity\scratch\nodejs;%PATH%" && npm run dev"

echo Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak >nul

echo [2/2] Launching Frontend Server (Port 5173)...
start "SmartFind Frontend" cmd /k "title SmartFind Frontend && cd /d "%~dp0frontend" && set "PATH=C:\Users\SUBHASHINI\.gemini\antigravity\scratch\nodejs;%PATH%" && npm run dev"

echo ===================================================
echo Servers launched!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ===================================================
