
$env:PATH += ";C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\14.44.35207\bin\Hostx64\x64"
$env:npm_config_target="39.3.0"
$env:npm_config_runtime="electron"
$env:npm_config_disturl="https://electronjs.org/headers"
$env:npm_config_build_from_source="true"

cd node_modules/@vscode/sqlite3
npm install --build-from-source
