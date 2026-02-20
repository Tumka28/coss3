# Script to rebuild all native modules without Spectre mitigation requirement

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Rebuilding All Native Modules" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$nativeModules = @(
    "@vscode/deviceid",
    "@vscode/kerberos",
    "@vscode/native-is-elevated",
    "native-keymap",
    "@vscode/native-watchdog",
    "node-pty",
    "@vscode/policy-watcher",
    "@vscode/spdlog",
    "@vscode/sqlite3",
    "@parcel/watcher",
    "@vscode/windows-ca-certs",
    "@vscode/windows-foreground-love",
    "@vscode/windows-mutex",
    "@vscode/windows-process-tree",
    "@vscode/windows-registry"
)

# Function to disable Spectre mitigation in binding.gyp
function Disable-SpectreMitigation {
    param([string]$bindingFile)
    
    if (Test-Path $bindingFile) {
        $content = Get-Content $bindingFile -Raw
        if ($content -match '"SpectreMitigation"\s*:\s*"Spectre"') {
            Write-Host "  Disabling Spectre mitigation in $bindingFile" -ForegroundColor Yellow
            $content = $content -replace '"SpectreMitigation"\s*:\s*"Spectre"', '"SpectreMitigation": "false"'
            Set-Content -Path $bindingFile -Value $content -NoNewline
        }
    }
}

foreach ($module in $nativeModules) {
    $modulePath = "node_modules\$module"
    $bindingPath = "$modulePath\binding.gyp"
    
    if (Test-Path $modulePath) {
        Write-Host "Processing $module..." -ForegroundColor Green
        
        # Disable Spectre mitigation if binding.gyp exists
        if (Test-Path $bindingPath) {
            Disable-SpectreMitigation -bindingFile $bindingPath
        }
        
        # Rebuild the module
        Write-Host "  Rebuilding $module..." -ForegroundColor Gray
        $result = npm rebuild $module 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Success: $module rebuilt" -ForegroundColor Green
        } else {
            Write-Host "  Failed: $module rebuild failed" -ForegroundColor Red
        }
        Write-Host ""
    } else {
        Write-Host "Skipping $module (not installed)" -ForegroundColor DarkGray
    }
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Rebuild Complete!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
