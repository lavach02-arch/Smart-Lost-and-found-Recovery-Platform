@echo off
title Push SmartFind to GitHub
echo ===================================================
echo Pushing SmartFind Platform to GitHub...
echo Target: https://github.com/lavach02-arch/Smart-Lost-and-found-Recovery-Platform.git
echo ===================================================
echo.

set "PATH=C:\Users\SUBHASHINI\.gemini\antigravity\scratch\git\cmd;%PATH%"
cd /d "%~dp0"

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo [SUCCESS] Your project has been successfully pushed to GitHub!
    echo Check it here: https://github.com/lavach02-arch/Smart-Lost-and-found-Recovery-Platform
    echo ===================================================
) else (
    echo ===================================================
    echo [NOTICE] If the repository does not exist on GitHub yet:
    echo 1. Go to https://github.com/new
    echo 2. Repository name: Smart-Lost-and-found-Recovery-Platform
    echo 3. Keep it Public (or Private) and DO NOT check "Add README"
    echo 4. Click "Create repository"
    echo 5. Re-run this push script!
    echo ===================================================
)
echo.
pause
