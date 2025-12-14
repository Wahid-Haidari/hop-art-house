# 🎨 Hop Art House

> An immersive 3D virtual art gallery celebrating human-made digital art in the age of AI.

**[Live Demo →](https://www.hoparthouse.com)**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r181-black?style=flat-square&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## 📖 About

Hop Art House is a curated virtual gallery showcasing digital artworks made by humans, not algorithms. In an era of AI-generated images, we celebrate the human spirit behind true artistic creation. Each piece is accompanied by process videos proving the authentic human touch.

Walk through our 3D gallery space, explore artwork up close, and purchase prints to support real artists.

## ✨ Features

- **Immersive 3D Environment** - Walk through a virtual gallery using React Three Fiber
- **First-Person Navigation** - Desktop: WASD/arrow keys + mouse look | Mobile: Virtual joystick + touch controls
- **Interactive Artworks** - Click/tap artworks to view in fullscreen with artist information
- **Shopping Cart** - Add prints to cart with size selection and quantity controls
- **Fully Responsive** - Optimized experience for desktop and mobile devices
- **Mobile-First Touch Controls** - Custom joystick, look-around gestures, and intuitive UI
- **Smooth Animations** - Scroll-based transitions, drawer animations, and polished interactions

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI components with latest features |
| **React Three Fiber** | Declarative 3D rendering |
| **Three.js** | WebGL-powered 3D graphics |
| **@react-three/drei** | Useful helpers for R3F |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Wahid-Haidari/hop-art-house.git
cd hop-art-house

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the gallery.

### Build for Production

```bash
npm run build
npm start
```

## 🎮 Controls

### Desktop
- **W/A/S/D** or **Arrow Keys** - Move around
- **Mouse** - Look around (click to enable pointer lock)
- **Q/E** - Move up/down
- **Click artwork** - View fullscreen

### Mobile
- **Left Joystick** - Move around
- **Touch & Drag** - Look around
- **Up/Down Buttons** - Elevate view
- **Tap artwork** - View fullscreen

## 📁 Project Structure

```
hop-art-house/
├── app/
│   ├── components/      # React components
│   │   ├── Player.tsx          # First-person camera controller
│   │   ├── GalleryArtwork.tsx  # 3D artwork display with raycasting
│   │   ├── MobileControls.tsx  # Touch joystick & gestures
│   │   ├── PurchasePanel.tsx   # 3D shopping UI
│   │   ├── CartContext.tsx     # Shopping cart state
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   └── useMobile.ts        # Responsive detection
│   ├── page.tsx         # Main gallery scene
│   └── layout.tsx       # Root layout
├── public/              # Static assets (artworks, fonts)
└── ...
```

## 🎯 Key Technical Highlights

- **Custom Raycasting** - Precise click/touch detection on 3D objects
- **Touch Event Handling** - Unified gesture system for tap vs drag detection
- **SSR Hydration** - Proper handling with `useSyncExternalStore`
- **Performance Optimized** - Efficient 3D rendering with proper cleanup
- **Accessibility** - Keyboard navigation and mobile-first design

## 📝 License

This project is proprietary. All artwork displayed is owned by their respective artists.

## 👤 Author

**Wahid Haidari**

- GitHub: [@Wahid-Haidari](https://github.com/Wahid-Haidari)

---

<p align="center">
  <i>Art made by humans still holds warmth, depth, and wonder.</i>
</p>
