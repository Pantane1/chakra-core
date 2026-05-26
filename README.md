# ⚡ CHAKRA CORE

> Real-time AI-powered hand tracking & anime-style AR aura effects in the browser.

Built with **MediaPipe Hands** + **Canvas API** + **Three.js** (GPU layer).  
Designed by **[Pantane Designs](https://pantane1.github.io/Nitram/)**.
[![Reach Me](https://img.shields.io/badge/ContactMe-purple)](https://nf.d.netlify.app)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- A modern browser (Chrome / Edge recommended for best MediaPipe support)
- Webcam

### Install & Run

```bash
# Clone or unzip the project
cd chakra-core

# Install dependencies
npm install

# Start dev server (opens http://localhost:3000)
npm run dev
```

> **Camera access** — allow the browser camera permission prompt when it appears.

### Build for Production

```bash
npm run build
# output → dist/
npm run preview  # preview the production build locally
```

---

## 📁 Project Structure

```
chakra-core/
├── index.html                 # App shell + HUD markup
├── vite.config.js
├── src/
│   ├── main.js                # Entry point
│   ├── app.js                 # Main orchestrator
│   ├── config.js              # All tunable parameters
│   ├── camera/webcam.js       # Camera stream manager
│   ├── tracking/
│   │   ├── hands.js           # MediaPipe Hands wrapper
│   │   ├── landmarks.js       # Landmark indices + helpers
│   │   └── gestures.js        # Gesture classifier
│   ├── effects/
│   │   ├── aura.js            # High-level aura controller
│   │   ├── particles.js       # Orbital particle system
│   │   ├── glow.js            # Glow canvas helpers
│   │   └── shaders.js         # GLSL for future Three.js use
│   ├── renderer/
│   │   ├── canvasRenderer.js  # 2-D canvas renderer
│   │   ├── threeRenderer.js   # Three.js scene scaffold
│   │   └── animationLoop.js   # rAF loop wrapper
│   ├── ui/
│   │   ├── hud.js             # FPS / hand / gesture HUD
│   │   ├── loadingScreen.js   # Init loading overlay
│   │   └── debugPanel.js      # Debug data panel
│   └── utils/
│       ├── math.js            # lerp, dist2D, mapRange …
│       ├── performance.js     # FPS monitor
│       └── helpers.js         # DOM helpers, hexToRgb …
├── public/styles/global.css   # Cyberpunk HUD styles
└── docs/
    ├── architecture.md
    ├── gestures.md
    └── roadmap.md
```

---

## 🎮 Controls

| Action | Effect |
|--------|--------|
| Show hands to camera | Activates tracking + aura |
| Open palm | Expands aura field |
| Closed fist | Compresses aura |
| Both fists close together | **TWO_HAND_CHARGE** pulse |
| Click **DEBUG ○** button | Toggles debug data panel |

---

## ⚙️ Configuration

All parameters live in `src/config.js`:

```js
CONFIG.aura.particleCount  = 80    // particles per hand
CONFIG.aura.orbitRadius    = 60    // orbit size (px)
CONFIG.aura.colorPrimary   = '#00d4ff'
CONFIG.hands.maxNumHands   = 2
```

---

## 🔭 Roadmap

See [`docs/roadmap.md`](docs/roadmap.md) and [`docs/gestures.md`](docs/gestures.md).

Key next steps:
- TensorFlow.js ML gesture classifier
- Three.js GPU particle system (GLSL shaders ready in `effects/shaders.js`)
- Combo system + charge beam between hands

---

## 📄 License

[`_MIT— © 2025_ Pantane Designs`](/LICENCE) 

<p align="center">
  <a href="#"><img src="http://readme-typing-svg.herokuapp.com?color=ACAF50&center=true&vCenter=true&multiline=false&lines=LONG+LIVE+THE+NJAGI'S" alt="">
</p>
