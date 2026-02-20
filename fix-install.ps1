# Fix npm install for coss2 (Node 22 + clean node_modules)
$ErrorActionPreference = "Stop"
$projectRoot = "C:\Users\Core\coss2"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host " coss2 install fix" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Check Node version
$nodeVer = (node -v 2>$null) -replace 'v',''
$major = [int]($nodeVer.Split('.')[0])
if ($major -ge 24) {
    Write-Host "`nWARNING: You are using Node $nodeVer. This repo needs Node 22.x (see .nvmrc)." -ForegroundColor Yellow
    Write-Host "Native modules (@vscode/spdlog, etc.) will fail on Node 24.`n" -ForegroundColor Yellow
    Write-Host "Switch to Node 22 first, e.g.:" -ForegroundColor Yellow
    Write-Host "  nvm install 22.21.1" -ForegroundColor White
    Write-Host "  nvm use 22.21.1`n" -ForegroundColor White
    $cont = Read-Host "Continue anyway? (y/N)"
    if ($cont -ne 'y' -and $cont -ne 'Y') { exit 1 }
}

Set-Location $projectRoot

Write-Host "`nRemoving node_modules..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    if (Test-Path "node_modules") {
        Write-Host "Could not remove node_modules (files in use). Close Cursor/terminals using this folder and run again." -ForegroundColor Red
        exit 1
    }
}
Write-Host "Done.`n" -ForegroundColor Green

Write-Host "Running npm install..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nnpm install failed. See FIX_INSTALL_AND_WATCH.md for more options." -ForegroundColor Red
    exit 1
}

Write-Host "`n======================================" -ForegroundColor Green
Write-Host " Install complete. Run: npm run watch" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
