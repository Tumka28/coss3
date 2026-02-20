# 🔄 Cursor IDE-г Restart хийж Multi-Model Features турших

## 🎯 Яагаад Cursor restart хийх хэрэгтэй вэ?

Манай multi-model features нь **VS Code Core** codebase-д нэмэгдсэн:
- ✅ TypeScript compilation амжилттай (0 errors)
- ✅ Watch mode ажиллаж байна
- ✅ Code аль хэдийн compile болсон

Гэхдээ Cursor IDE одоо **хуучин version** ашиглаж байна. Restart хийхэд **шинэ compiled code** ашиглана!

---

## 📋 Алхам 1: Cursor бүрэн хаах

1. Cursor IDE дээр бүх файлуудыг хаах
2. Cursor бүрэн exit хийх (Alt+F4 эсвэл X дарах)

---

## 📋 Алхам 2: Development VS Code folder нээх

### Сонголт A: Cursor-ийг манай compiled code-оор ажиллуулах

**PowerShell дээр:**

```powershell
cd C:\Users\Core\Desktop\vscode

# Манай compiled VS Code ажиллуулах (watch mode ажиллаж байх ёстой!)
.\scripts\code.bat
```

Энэ нь манай **шинэ compiled code**-той VS Code нээнэ!

---

### Сонголт B: Cursor IDE дахин нээх (хэрэв Cursor манай code ашигладаг бол)

Хэрэв Cursor нь танай `C:\Users\Core\Desktop\vscode` folder-ыг development environment гэж ашигладаг бол:

```
1. Cursor дахин нээх
2. File → Open Folder
3. C:\Users\Core\Desktop\vscode нээх
4. Cursor development mode-д орно
```

---

## 📋 Алхам 3: Multi-Model Commands турших

VS Code / Cursor нээгдсэний дараа:

### 1️⃣ Command Palette нээх

```
F1 эсвэл Ctrl+Shift+P
```

### 2️⃣ Эдгээр командуудыг хайх:

```
> Select Chat Model
> Select Debug Assistant Model
> Select Tasks AI Model
> Select File Operations AI Model
> Select Agents Model
> Select Inline Chat Model
> Show Model Configuration
> Reset Model Preferences
```

### 3️⃣ Команд олдвол → 🎉 АМЖИЛТТАЙ!

---

## 🆘 Хэрэв командууд олдохгүй бол:

### Developer Console шалгах:

```
Help → Toggle Developer Tools
```

Console дээр алдаа байгаа эсэхийг шалгах.

---

## ✅ Хамгийн найдвартай арга:

### `.\scripts\code.bat` ашиглах:

**Энэ нь:**
- ✅ Манай compiled code шууд ажиллуулна
- ✅ Watch mode-ийн хамгийн сүүлийн өөрчлөлтүүдтэй
- ✅ Development environment
- ✅ All features идэвхтэй

**PowerShell дээр:**

```powershell
# Terminal 1: Watch mode үргэлжилж байгаа эсэхийг шалгах
# npm run watch  ← Энэ ажиллаж байх ёстой!

# Terminal 2: Custom VS Code ажиллуулах
cd C:\Users\Core\Desktop\vscode
.\scripts\code.bat
```

---

## 🎯 Хүлээгдэж буй үр дүн:

VS Code нээгдэхэд:
```
✅ F1 дарахад Command Palette нээгдэнэ
✅ "Select Chat Model" бичихэд команд олдоно
✅ Команд дарахад Model Picker харагдана
✅ Available models жагсаалт (хоосон байж болно, гэхдээ UI ажиллана)
```

---

## 📊 Timeline:

```
1. ✅ Code бичсэн
2. ✅ Compilation амжилттай (0 errors)
3. ✅ Watch mode ажиллаж байна
4. ⏳ .\scripts\code.bat ажиллуулах
5. ⏳ F1 → Commands турших
6. 🎉 АМЖИЛТТАЙ!
```

---

**Одоо `.\scripts\code.bat` ажиллуулаад турших үү?** 🚀
