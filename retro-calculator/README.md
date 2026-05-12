# 🎮 RETRO CALC 9000

A pixel-art calculator with CRT effects, scanlines, and retro sounds.

```
╔══════════════════════════════════════╗
║   🎮 RETRO CALCULATOR — ONLINE 🎮   ║
╚══════════════════════════════════════╝
```

## ✨ Features

- **Design** : CRT terminal, phosphor green screen, scanlines, pixel-art buttons
- **Font** : Press Start 2P (Google Fonts)
- **Operations** : + − × ÷ % √ ( ) and decimal comma
- **Error handling** : division by zero, syntax errors, infinite results
- **Keyboard** : full keyboard support (see table below)
- **Sounds** : optional retro 8-bit beeps via Web Audio API
- **Animations** : power-on boot sequence, CRT sweep, cursor blink, button press

## 📁 Project Structure

```
retro-calculator/
├── public/
│   ├── index.html          # Main HTML (semantic, ARIA)
│   ├── css/
│   │   └── style.css       # CRT effects, pixel art, responsive
│   └── js/
│       └── calculator.js   # Engine + keyboard + sounds
├── server.js               # Express static server
├── package.json
├── vercel.json             # Vercel deployment config
└── README.md
```

## 🚀 Local Development

```bash
npm install
npm start
# → http://localhost:3000
```

## ☁️ Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deploys.

## ⌨️ Keyboard Shortcuts

| Key            | Action         |
|----------------|----------------|
| `0–9`          | Digit          |
| `.` or `,`     | Decimal        |
| `+` `-` `*` `/`| Operators      |
| `%`            | Percent        |
| `(` `)`        | Parentheses    |
| `Enter` or `=` | Equals         |
| `Backspace`    | Delete last    |
| `Delete`       | Clear entry    |
| `Escape`       | Clear all (AC) |

## 🎨 Color Palette

| Role              | Color     |
|-------------------|-----------|
| Background        | `#0a0a0f` |
| Phosphor green    | `#00ff41` |
| Operator red      | `#ff3333` |
| Utility amber     | `#ffaa00` |
| Special blue      | `#4488ff` |

## 📄 License

MIT © 1984 RETROCORP
