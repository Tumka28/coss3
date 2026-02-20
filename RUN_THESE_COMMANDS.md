# 🚀 Visual Studio суулгагдсан - Одоо эдгээр командуудыг ажиллуул!

## ✅ Алхам 1: Visual Studio шалгах

```powershell
where.exe cl.exe
```

**Хүлээгдэж буй үр дүн:**
```
C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\...\cl.exe
```

---

## ✅ Алхам 2: npm install дахин ажиллуулах

```powershell
cd C:\Users\Core\Desktop\vscode

npm install
```

**Юу болох вэ?**
- ✅ node-gyp одоо амжилттай ажиллана (Visual Studio ашиглана)
- ✅ Бүх native dependencies compile болно
- ⏰ 10-15 минут шаардлагатай

---

## ✅ Алхам 3: Watch mode эхлүүлэх

```powershell
npm run watch
```

**Хүлээгдэж буй үр дүн:**
```
[watch-client] Finished compilation with 0 errors
[watch-extensions] Finished compilation with 0 errors
```

---

## ✅ Алхам 4: Custom VS Code ажиллуулах!

**Өөр PowerShell terminal нээгээд:**

```powershell
cd C:\Users\Core\Desktop\vscode
.\scripts\code.bat
```

**Үр дүн:**
```
🎉 Танай Custom VS Code нээгдэнэ!
🎯 Multi-model features идэвхтэй болно!
```

---

## 🎯 Бүх командууд хамтад нь:

```powershell
# 1. Visual Studio шалгах
where.exe cl.exe

# 2. VS Code folder руу очих
cd C:\Users\Core\Desktop\vscode

# 3. Dependencies суулгах
npm install

# 4. Watch mode (энэ terminal нээлттэй үлдээх)
npm run watch

# 5. Өөр terminal нээгээд ажиллуулах
.\scripts\code.bat
```

---

**Эдгээр командуудыг хуулаад PowerShell дээр ажиллуулаарай!** 🚀
