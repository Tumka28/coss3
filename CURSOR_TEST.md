# Cursor Multi-Model Тест

## 🎯 Cursor-д Одоо Байгаа AI Features

Cursor дээр дараах зүйлсийг шалгаарай:

### 1️⃣ Settings → Models

1. **Cursor нээх**
2. **Ctrl+Shift+,** (Settings)
3. Хайх: **"model"** эсвэл **"AI"**
4. Cursor-ийн model тохиргоог хар

### 2️⃣ Command Palette

**F1** эсвэл **Ctrl+Shift+P** дараад:

```
Cursor: Settings
Cursor: Model
AI Model
Select Model
```

### 3️⃣ Cursor Tabs

- **Ctrl+L** - Chat
- **Ctrl+K** - Inline edit
- **Ctrl+I** - Composer

Энэ feature бүрт өөр model сонгож болох уу?

### 4️⃣ Settings JSON

**F1** → `Open User Settings (JSON)`

Хайж үзээрэй:
```json
{
  "cursor.chat.model": "...",
  "cursor.composer.model": "...",
  "cursor.inline.model": "..."
}
```

## 🎉 Cursor Аль хэдийн Multi-Model Дэмжиж Байвал

Хэрэв Settings дотор model сонголт олдвол:
- ✅ Cursor **аль хэдийн** multi-model дэмжиж байна!
- ✅ Feature бүрт өөр model сонгож болно
- ✅ Манай санаа **аль хэдийн хэрэгжсэн** байна!

## 📋 Cursor Settings Example

```json
{
  // Chat Model
  "cursor.chat.model": "claude-3.5-sonnet",
  
  // Inline Edit Model
  "cursor.inline.model": "gpt-4o",
  
  // Composer Model  
  "cursor.composer.model": "claude-3.5-sonnet",
  
  // Auto-complete
  "cursor.autocomplete.model": "gpt-4o-mini"
}
```

## 🔧 Манай VS Code Код Cursor дээр Ажиллуулах

Хэрэв Cursor-д манай custom implementation туршихыг хүсвэл:

### Сонголт 1: Extension Үүсгэх

```bash
# Extension template үүсгэх
npm install -g yo generator-code
yo code

# Манай multi-model код extension болгох
# vscode.proposed.multiModelContext.d.ts ашиглах
```

### Сонголт 2: Cursor Source Засах

```bash
# Cursor-ийн installation folder-г ол
# Windows: C:\Users\{User}\AppData\Local\Programs\cursor
# Mac: /Applications/Cursor.app

# Cursor нь VS Code fork учраас
# Манай засварыг Cursor source дээр apply хийж болно
```

### Сонголт 3: Cursor-ийн Built-in Features Ашиглах

**Хамгийн энгийн**: Cursor-ийн одоогийн AI features-ийг ашиглаарай!

---

## 🎯 Дараагийн Алхам

1. **Cursor нээх**
2. **Settings шалгах** (Ctrl+Shift+,)
3. **Model тохиргоо хайх**
4. **F1** → "Model" гэж хайх

Cursor-д юу олдсоноо надад хэлээрэй! 😊
