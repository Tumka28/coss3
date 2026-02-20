$files = @(
    "node_modules\@vscode\spdlog\binding.gyp",
    "node_modules\@vscode\policy-watcher\binding.gyp",
    "node_modules\@vscode\windows-process-tree\binding.gyp",
    "node_modules\@vscode\windows-mutex\binding.gyp",
    "node_modules\@vscode\deviceid\binding.gyp",
    "node_modules\@vscode\native-watchdog\binding.gyp",
    "node_modules\@vscode\windows-ca-certs\binding.gyp",
    "node_modules\@vscode\windows-registry\binding.gyp",
    "node_modules\@vscode\sqlite3\binding.gyp",
    "node_modules\kerberos\binding.gyp",
    "node_modules\native-keymap\binding.gyp",
    "node_modules\native-is-elevated\binding.gyp",
    "node_modules\node-pty\binding.gyp",
    "node_modules\windows-foreground-love\binding.gyp"
)

$root = "C:\Users\Core\coss2"
foreach ($f in $files) {
    $path = Join-Path $root $f
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $updated = $content -replace '"SpectreMitigation":\s*"Spectre"', '"SpectreMitigation": "false"'
        if ($content -ne $updated) {
            Set-Content $path $updated -NoNewline
            Write-Host "Patched: $f"
        } else {
            Write-Host "No change: $f"
        }
    } else {
        Write-Host "Not found: $f"
    }
}
Write-Host "`nDone. All Spectre mitigations disabled."
