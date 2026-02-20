
$env:PATH = "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\14.44.35207\bin\Hostx64\x64;" + $env:PATH
$env:VCINSTALLDIR = "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\"
$env:GYP_MSVS_VERSION = "2022"

cd node_modules/@vscode/sqlite3
& ../../node_modules/.bin/node-gyp rebuild --target=39.3.0 --dist-url=https://electronjs.org/headers --runtime=electron --arch=x64
