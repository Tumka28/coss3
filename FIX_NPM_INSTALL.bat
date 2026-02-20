@echo off
echo ======================================
echo Fixing npm install permission issue
echo ======================================

cd /d C:\Users\Core\Desktop\vscode1

echo.
echo Step 1: Removing locked folder...
rmdir /s /q "node_modules\@parcel\watcher-win32-x64" 2>nul

echo Step 2: Running npm install with --ignore-scripts...
call npm install --ignore-scripts

echo.
echo Step 3: Running postinstall manually...
node build/npm/postinstall.ts

echo.
echo ======================================
echo Done! Press any key to exit...
echo ======================================
pause >nul
