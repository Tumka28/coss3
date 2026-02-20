# 🎯 Visual Studio Installation - Дараагийн Алхамууд

## ✅ Одоо юу болж байна?

```
Visual Studio Build Tools 2022 татагдаж байна
⏰ Download: ~12 минут үлдсэн
⏰ Installation: ~20-30 минут дараа нь
```

---

## 📋 Installation дууссаны дараа:

### Алхам 1: Installation амжилттай эсэхийг шалгах

Installer дээр дараах зүйлийг харах:
```
✅ "Setup Completed" эсвэл
✅ "Installation successful"
```

### Алхам 2: Visual Studio Command Prompt шалгах

**Шинэ PowerShell** terminal нээгээд:

```powershell
# cl.exe compiler шалгах
where.exe cl.exe
```

**Хүлээгдэж буй үр дүн:**
```
C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\...\cl.exe
```

Хэрэв олдвол → ✅ Visual Studio амжилттай суулгагдсан!

---

### Алхам 3: VS Code Dependencies Дахин Суулгах

```powershell
cd C:\Users\Core\Desktop\vscode

# npm install дахин ажиллуулах
npm install
```

**Одоо юу болох вэ?**
- ✅ node-gyp амжилттай C++ module compile хийнэ
- ✅ Бүх dependencies суух
- ⏰ 10-15 минут шаардлагатай

---

### Алхам 4: Watch Mode эхлүүлэх

```powershell
npm run watch
```

**Хүлээгдэж буй үр дүн:**
```
[watch-client] Finished compilation with 0 errors after XXX ms
[watch-extensions] Finished compilation with 0 errors after XXX ms
```

---

### Алхам 5: Custom IDE ажиллуулах! 🎉

**Өөр PowerShell terminal** нээгээд:

```powershell
cd C:\Users\Core\Desktop\vscode
.\scripts\code.bat
```

**Хүлээгдэж буй үр дүн:**
```
🎉 Танай Custom VS Code нээгдэнэ!
🎯 Multi-model features идэвхтэй!
```

---

## ⏰ Бүрэн Timeline:

```
✅ Visual Studio татаж байна     [Одоо - 7%]
⏳ Download дуусах                [~12 мин]
⏳ Installation эхлэх              [~20-30 мин]
⏳ npm install                     [~10-15 мин]
⏳ npm run watch                   [~5 мин]
⏳ .\scripts\code.bat              [~1 мин]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 НИЙТ: ~50-65 минут
```

---

## 🆘 Хэрэв асуудал гарвал:

### ❌ Алдаа 1: cl.exe олдохгүй
```
→ Visual Studio Installer дахин нээх
→ "Desktop development with C++" installed эсэхийг шалгах
→ Эсвэл: Developer Command Prompt for VS 2022 нээх
```

### ❌ Алдаа 2: npm install тогтмол алдаа
```powershell
# npm cache цэвэрлэх
npm cache clean --force

# node_modules устгах
Remove-Item -Recurse -Force node_modules

# Дахин суулгах
npm install
```

### ❌ Алдаа 3: scripts\code.bat ажиллахгүй
```powershell
# Electron components татах
node build/lib/electron.ts

# Дахин оролдох
.\scripts\code.bat
```

---

## ✨ Амжилтын шинж тэмдэг:

```
✅ where.exe cl.exe → Path олдсон
✅ npm install → No errors
✅ npm run watch → Compilation successful
✅ .\scripts\code.bat → Custom VS Code нээгдсэн
✅ Ctrl+Shift+P → "Select Model for Context" command байгаа
✅ Multi-model features ажиллаж байна! 🎉
```

---

**Visual Studio installation дууссаны дараа надад "Visual Studio суулгаж дууслаа" гэж хэл!** 😊

Би npm install алхамыг явуулна! 🚀
