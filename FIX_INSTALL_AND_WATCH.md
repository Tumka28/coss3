# Fix npm install and watch (Windows)

## What went wrong

1. **Node version**: This repo needs **Node 22.x** (see `.nvmrc`: 22.21.1). You're on **Node 24.x**, which breaks native modules.
2. **MSB8040 – Spectre-mitigated libraries**: Build fails with "Spectre-mitigated libraries are required". Visual Studio Build Tools need the Spectre libs component.
3. **TAR_ENTRY_ERROR / ENOTEMPTY / EPERM**: `node_modules` is partial or locked (Cursor, terminal, antivirus). npm can't clean or extract properly.
4. **ERR_MODULE_NOT_FOUND (e.g. vinyl-fs)**: `node_modules` was never fully installed, so `.\scripts\code.bat` fails.

---

## Step 1: Use Node 22

### Option A – nvm-windows (recommended)

If you use [nvm-windows](https://github.com/coreybutler/nvm-windows):

```powershell
nvm install 22.21.1
nvm use 22.21.1
node -v   # should show v22.21.1
```

### Option B – Install Node 22 from nodejs.org

1. Go to https://nodejs.org/ (LTS is 22.x).
2. Download and install the **Windows 64-bit LTS** installer.
3. Close and reopen PowerShell, then run `node -v` and confirm it shows v22.x.

---

## Step 2: Install Spectre-mitigated libraries (for native modules)

If you see **MSB8040: Spectre-mitigated libraries are required** when building `@vscode/native-watchdog` or other native addons:

1. Open **Visual Studio Installer** (search in Start).
2. Click **Modify** on **Visual Studio 2022 Build Tools**.
3. Open the **Individual components** tab.
4. Search for **Spectre**.
5. Check **MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs** (or the x64 one that matches your build).
6. Click **Modify** and wait for the install to finish.

Then retry `npm install`.

---

## Step 3: Clean and reinstall (critical: nothing locking the folder)

**Close Cursor and any terminal using coss2** so nothing holds locks on `node_modules`. Use a **new** PowerShell window. Do this with **no other program using the `coss2` folder** (close Cursor on this workspace, or use a new PowerShell window and don’t open the folder in the editor).

```powershell
# Start from outside coss2 so nothing locks the folder
cd C:\Users\Core
cmd /c "rd /s /q C:\Users\Core\coss2\node_modules"
cd C:\Users\Core\coss2
npm cache clean --force
npm install
```

If `rd /s /q` fails, run PowerShell as Administrator or restart the PC and run again before opening Cursor.

---

## Step 4: Run watch (after install succeeds)

```powershell
cd C:\Users\Core\coss2
npm run watch
```

When watch is running with no errors, in a **second** terminal:

```powershell
cd C:\Users\Core\coss2
.\scripts\code.bat
```

---

## If native modules still fail

Use install with scripts skipped, then run postinstall by hand (same idea as `FIX_NPM_INSTALL.bat`, but for this repo):

```powershell
cd C:\Users\Core\coss2
npm install --ignore-scripts
node build/npm/postinstall.ts
```

Then try `npm run watch` again.

**Checklist if native addons still fail:** Node 22.x (`node -v`), VS 2022 Build Tools with Desktop development with C++, **Spectre-mitigated libs** (Individual components), and `node_modules` removed/reinstalled with no IDE using the folder. If `@vscode/spdlog` or other native addons still fail, stay on **Node 22.21.1** and ensure Visual Studio Build Tools with “Desktop development with C++” is installed.
