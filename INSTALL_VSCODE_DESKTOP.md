# 📥 VS Code Desktop суулгаж Extensions турших

## 🎯 Яагаад энэ хэрэгтэй вэ?

```
❌ Cursor суулгаагүй байна
❌ Custom VS Code build executable үүсгэхэд хэцүү байна
❌ VS Code Web дээр Extensions ажиллахгүй
```

**Шийдэл:**
```
✅ Official VS Code татаж авах (5 минут)
✅ Extensions бүрэн дэмжигдэнэ
✅ Chat + AI features идэвхтэй
✅ Манай multi-model commands турших боломжтой
```

---

## 📋 АЛХАМ 1: VS Code татаж авах

### 1️⃣ Browser нээгээд энэ хаягаар очих:

```
https://code.visualstudio.com/Download
```

### 2️⃣ "Windows" User Installer татах

**Энд дарах:**
```
Windows → "User Installer" → 64 bit
```

**Татагдаж буй файл:**
```
VSCodeUserSetup-x64-1.96.x.exe
```

### 3️⃣ Installer ажиллуулах

```
1. Татагдсан .exe файл дээр double-click
2. "I accept the agreement" → Next
3. "Create a desktop icon" check → Next
4. Install → Finish
```

**Хугацаа:** ~2-3 минут

---

## 📋 АЛХАМ 2: VS Code нээгээд Extensions суулгах

### 1️⃣ VS Code нээх

```
Desktop дээрх "Visual Studio Code" icon дээр double-click
ЭСВЭЛ
Start Menu → "Visual Studio Code"
```

### 2️⃣ Folder нээх (OPTIONAL - Одоо шаардлагагүй)

```
File → Open Folder...
→ C:\Users\Core\Desktop\vscode сонгох
```

**⚠️ АНХААРУУЛГА:** Энэ нь development folder, том файлууд бүхий. Эхлээд skip хийж болно!

### 3️⃣ Extensions View нээх

```
Ctrl+Shift+X
ЭСВЭЛ
Зүүн талын хажуугийн menu дээр Extensions icon (square icon) дарах
```

---

## 📋 АЛХАМ 3: AI Chat Extensions суулгах

### 🔍 Extension 1: GitHub Copilot Chat

**Extensions search box дээр:**
```
"GitHub Copilot Chat"
```

**"GitHub Copilot Chat" extension олох:**
```
Publisher: GitHub
→ Install товч дарах
```

**⚠️ Анхааруулга:** GitHub Copilot-д **subscription** шаардлагатай (paid service)

**Хэрэв subscription байхгүй бол →** Next extension руу!

---

### 🔍 Extension 2: Continue - Free AI Code Assistant

**Extensions search box дээр:**
```
"Continue"
```

**"Continue - Codestral, Claude, and more" extension олох:**
```
Publisher: Continue
→ Install товч дарах
```

**✅ Continue нь үнэгүй!** Multiple AI models дэмждэг:
- Claude
- GPT-4
- Codestral
- Local models (Ollama)

---

### 🔍 Extension 3: Codeium

**Extensions search box дээр:**
```
"Codeium"
```

**"Codeium: AI Coding Autocomplete and Chat" extension олох:**
```
Publisher: Codeium
→ Install товч дарах
```

**✅ Codeium нь үнэгүй!**

---

## 📋 АЛХАМ 4: Chat Features турших

### Extension суулгасны дараа:

#### **Continue extension:**

1. Зүүн sidebar дээр **Continue icon** гарч ирнэ
2. Click хийж Chat view нээх
3. Model сонгох (Claude, GPT-4, etc.)
4. Chat хийж турших!

#### **Codeium extension:**

1. Доод баруун буланд **Codeium** status харагдана
2. Ctrl+Shift+P → "Codeium: Open Chat"
3. Chat хийж турших!

#### **GitHub Copilot Chat:**

1. Sidebar дээр **Copilot Chat icon** гарна
2. Click хийж Chat view нээх
3. GitHub account sign in хийх
4. Chat хийж турших!

---

## 🎯 АЛХАМ 5: Манай Multi-Model Commands турших (OPTIONAL)

Хэрэв манай **custom code**-той folder нээх бол:

```
File → Open Folder → C:\Users\Core\Desktop\vscode
```

**Дараа нь:**

1. Terminal нээх: Ctrl+`
2. Watch mode эхлүүлэх:
   ```powershell
   npm run watch
   ```
3. Watch mode 0 errors хүртэл хүлээх
4. F1 дараад командуудыг турших:
   ```
   > Select Chat Model
   > Select Debug Assistant Model
   > Select Tasks AI Model
   ```

**⚠️ Гэхдээ энэ нь development mode**, суулгасан VS Code дээр custom code яг ажиллахгүй байж магадгүй.

**Манай custom features-ийг турихын тулд custom build хэрэгтэй!**

---

## 🎉 Одоо ажиллах боломжтой зүйлс:

### ✅ Official VS Code суулгасан бол:

```
✅ Extensions бүрэн ажиллана
✅ Chat features (Continue, Codeium) идэвхтэй
✅ AI code assistance
✅ Marketplace-с ямар ч extension суулгах боломжтой
```

### ⏳ Манай custom multi-model features турихын тулд:

```
→ Custom build үүсгэх шаардлагатай
→ Electron executable compile хийх
→ ЭСВЭЛ Cursor IDE татаж авах (VS Code fork)
```

---

## 🚀 Одоо юу хийх вэ?

### Сонголт A: VS Code татаж аваад AI extensions турших

```
1. https://code.visualstudio.com/Download
2. Windows User Installer (64-bit) татах
3. Суулгах
4. Ctrl+Shift+X → "Continue" эсвэл "Codeium" суулгах
5. Chat хийж турших!
```

**Хугацаа:** 5-10 минут

---

### Сонголт B: Cursor IDE татаж авах

Cursor нь VS Code-ийн fork, built-in AI chat-тай!

```
1. https://cursor.sh
2. Windows installer татах
3. Суулгах
4. Built-in AI chat шууд ажиллана!
```

**Хугацаа:** 5 минут

---

**Аль сонголт вэ?**

**A) VS Code татаж авах** → Extensions + Chat  
**B) Cursor татаж авах** → Built-in AI  
**C) Web version үргэлжлүүлэх** → Extensions байхгүй гэхдээ code editing ажиллана

---

**Миний санал: B) Cursor татаж авах** - хамгийн хялбар! 🚀
