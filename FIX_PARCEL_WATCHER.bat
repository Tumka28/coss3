@echo off
echo ======================================
echo Fixing @parcel/watcher module
echo ======================================

cd /d C:\Users\Core\Desktop\vscode1

echo.
echo Step 1: Installing @parcel/watcher in root...
call npm install --save-optional @parcel/watcher

echo.
echo Step 2: Rebuilding @parcel/watcher...
cd node_modules\@parcel\watcher
call npm run build

echo.
echo Step 3: Installing in extensions folder...
cd C:\Users\Core\Desktop\vscode1\extensions
call npm install --save-optional @parcel/watcher

echo.
echo Step 4: Rebuilding in extensions...
cd node_modules\@parcel\watcher
call npm run build

echo.
echo ======================================
echo Done! Now try npm run watch again
echo ======================================
pause
