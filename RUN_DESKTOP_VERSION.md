# 🚀 Desktop VS Code ажиллуулах (Extensions + Chat идэвхтэй)

## 🎯 Яагаад Desktop version хэрэгтэй вэ?

VS Code **Web** (localhost:8080):
```
❌ Extensions Marketplace хоосон
❌ Chat features байхгүй
❌ Desktop-only APIs ажиллахгүй
```

VS Code **Desktop**:
```
✅ Бүх Extensions ажиллана
✅ Chat + AI features идэвхтэй
✅ Манай multi-model commands ажиллана
✅ Full developer tools
```

---

## 📋 АРГА 1: Манай Compiled Desktop VS Code ажиллуулах

### Алхам 1: Watch mode ажиллаж байгаа эсэхийг шалгах

**PowerShell Terminal 1 шалгах:**

```powershell
# Хэрэв "npm run watch" ажиллаж байгаа бол → OK!
# Хэрэв зогссон бол → Ctrl+C дараад дахин:
npm run watch
```

### Алхам 2: Desktop version ажиллуулах

**Шинэ PowerShell Terminal 2 нээгээд:**

```powershell
cd C:\Users\Core\Desktop\vscode

# Desktop VS Code ажиллуулах:
.\scripts\code.bat
```

**Гэхдээ!** Өмнө `Code - OSS.exe` олдоогүй байсан...

### Хэрэв `.\scripts\code.bat` ажиллахгүй бол:

Electron executable байхгүй байна. Дараах командуудыг турших:

```powershell
# Electron татаж авах:
node build/lib/electron.ts --force

# Дараа нь дахин:
.\scripts\code.bat
```

---

## 📋 АРГА 2: Cursor IDE нээх (⭐ САНАЛ БОЛГОЖ БАЙНА!)

**Cursor** бол VS Code-ийн fork, бүх features идэвхтэй!

### Алхам 1: Cursor IDE нээх

**PowerShell:**

```powershell
# Cursor executable ажиллуулах:
& "C:\Users\Core\AppData\Local\Programs\cursor\Cursor.exe"
```

**ЭСВЭЛ:**
- Start Menu → "Cursor" хайж нээх

### Алхам 2: Folder нээх

Cursor нээгдсэний дараа:

```
File → Open Folder...
→ C:\Users\Core\Desktop\vscode сонгох
```

### Алхам 3: Extensions нээх

```
Ctrl+Shift+X  (Extensions view)
```

**Хайх:**
```
1. "GitHub Copilot Chat"
2. "Continue"
3. "Codeium"
4. "Chat"
```

**Install дарах!**

---

## 📋 АРГА 3: Visual Studio Code Desktop татаж авах

Хэрэв Cursor дээр ажиллахгүй бол, энгийн VS Code татаж авах:

### Татаж авах:

**Browser дээр очих:**
```
https://code.visualstudio.com/Download
```

**"Windows" system installer татах**

### Суулгаад нээх:

```
1. VS Code суулгах
2. File → Open Folder → C:\Users\Core\Desktop\vscode
3. Ctrl+Shift+X → Extensions
4. "GitHub Copilot Chat" хайж суулгах
```

---

## 🎯 Extensions суулгасны дараа:

### 1️⃣ GitHub Copilot Chat суулгах

Extensions дээр:
```
"GitHub Copilot Chat" хайх → Install
```

### 2️⃣ Chat View нээх

```
View → Open View... → "Chat" сонгох
```

**ЭСВЭЛ:**
```
Ctrl+Alt+I  (Chat view нээх shortcut)
```

### 3️⃣ Манай Multi-Model Commands турших

```
F1 → "Select Chat Model"
F1 → "Select Debug Assistant Model"
F1 → "Select Tasks AI Model"
```

---

## ✅ Хамгийн хялбар арга:

### Cursor IDE ашиглах:

```powershell
# 1. Cursor нээх
& "C:\Users\Core\AppData\Local\Programs\cursor\Cursor.exe"

# 2. File → Open Folder → C:\Users\Core\Desktop\vscode

# 3. Ctrl+Shift+X (Extensions)

# 4. "GitHub Copilot Chat" суулгах
```

**Дараа нь:**
- Chat view идэвхтэй болно
- F1 → манай командууд ажиллана
- Extensions бүрэн дэмжигдэнэ

---

## 🆘 Алдаа гарвал:

### `Code - OSS.exe` олдохгүй бол:

```powershell
cd C:\Users\Core\Desktop\vscode

# Electron шинээр татах:
node build/lib/electron.ts --force

# Pre-launch scripts ажиллуулах:
node build/lib/preLaunch.ts

# Дахин турших:
.\scripts\code.bat
```

### Electron алдаа гарвал:

→ **Cursor IDE ашиглах илүү хялбар!**

---

**Одоо Cursor IDE нээж үзэх үү?** 🚀
