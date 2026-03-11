# 🎂 BirthdayHer — Project Report

A beautiful, interactive birthday greeting web application built with React and Vite, dedicated to celebrating someone special.

---

## 📋 Project Overview

**BirthdayHer** is a full-screen, scroll-driven birthday experience featuring animated sections, parallax backgrounds, interactive elements, and a grand finale celebration. The site guides visitors through a series of heartfelt sections, culminating in a confetti-filled "HAPPY BIRTHDAY" climax.

**Dedicated to:** POOJA JI  
**Built with:** React 19 + Vite 7 + Tailwind CSS 4 + Framer Motion 12

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.4 | UI framework |
| Vite | ^7.3.1 | Build tool & dev server |
| Tailwind CSS | ^4.2.1 | Utility-first styling |
| Framer Motion | ^12.35.2 | Animations & transitions |
| canvas-confetti | ^1.9.4 | Confetti celebrations |
| @fontsource/dancing-script | ^5.2.8 | Cursive display font |
| react-icons | ^5.6.0 | Icon library |

---

## 🎬 Sections & Features

### 1. 🎂 Cake Section (`CakeSection.jsx`)
The opening screen features an interactive birthday cake with three animated candles.

- **Microphone-based blowing**: Requests mic access and detects when the user blows into the microphone using the Web Audio API. Candles extinguish when the average audio volume exceeds a threshold.
- **Click fallback**: Users can simply tap/click the cake to blow out the candles.
- Animated flame flicker and smoke effects using Framer Motion.

### 2. 💌 Hero Letter (`HeroLetter.jsx`)
An animated envelope that opens on tap/click to reveal a birthday letter.

- 3D envelope flap animation (`rotateX`) with Framer Motion.
- Confetti bursts from both sides of the screen on open.
- Letter slides up from inside the envelope with a paper texture.
- Scroll hint prompts the user to continue after reading.

### 3. 💖 About You (`AboutYou.jsx`)
A vertical carousel of 7 cards highlighting why the birthday person is special.

- Cards: *Super Cute, Amazing Smile, Kind Heart, Brilliant Mind, Great Listener, Fun Spirit, Absolutely Unique*.
- Spring-physics card transitions (scroll or swipe to navigate).
- Progress indicator dots inside each card.
- Animated avatar stickers from DiceBear API.

### 4. 💬 My Thoughts (`MyThoughts.jsx`)
A heartfelt personal message section.

- Clean card layout with a large white/glass card.
- Spring-bounce entrance animation when scrolled into view.
- Decorative dot-pattern background.

### 5. 📸 Gallery (`Gallery.jsx`)
A Polaroid-style photo gallery.

- 6 images in a responsive 1/2/3-column grid.
- Each image has a slight random rotation, a tape decoration, and a grayscale → color hover effect.
- Staggered entrance animations on scroll.

### 6. 🎉 Wishes Climax (`WishesClimax.jsx`)
The grand finale screen.

- Large "BIRTHDAY" text with letter-by-letter stagger animation.
- Three girl cutout PNG images animate in at different Z-indices, depths, and delays, creating a layered parallax effect.
- "Happy" cursive text overlays the scene with a spring rotation.
- Date and name badges in the corners.
- Physics-based confetti from both sides of the screen fires when the main cutout lands.
- Floating kawaii emoji stickers (🐱 🐰 ✨) with infinite looping animations.

---

## 🎨 Visual Design

- **Background**: A rotating radial gradient (pink → mint → teal → yellow) behind a multi-layer parallax scene.
- **Parallax Layers**: Clouds (slow), mountains (medium), and flowers (fast) shift vertically as the user scrolls through sections.
- **Floating Particles**: 60 magical particles float across the background continuously.
- **Color Palette**: Soft pastels — cute pink, mint green, teal (`#5F9EA0`), warm yellow, and lavender.
- **Typography**: System sans-serif body + "Dancing Script" for cursive display text.

---

## 🧭 Navigation

The app uses a **full-page scroll-jacking** approach:

- **Mouse wheel**: Scrolling past section boundaries triggers the next/previous section transition (debounced at 2s to prevent double-firing).
- **Touch swipe**: Swipe up/down with 50 px threshold triggers section changes.
- **AboutYou carousel**: Within section 2, scroll/swipe navigates cards internally before advancing to the next section.
- **Cake section guard**: Scroll is disabled on the opening cake screen until the candles are blown out.
- **Navigation dots**: Visible on sections 1–4 to indicate position.
- **Back navigation**: Prevented from returning to the cake section (step 0) once advanced.

---

## 📁 Project Structure

```
src/
├── main.jsx                    # App entry point
├── App.jsx                     # Root component: scroll handling, section orchestration
├── App.css                     # Global styles
├── index.css                   # Tailwind base imports
├── components/
│   ├── ParallaxBackground.jsx  # Multi-layer parallax scene
│   └── FloatingParticles.jsx   # Animated floating particle system
└── sections/
    ├── CakeSection.jsx         # Interactive birthday cake
    ├── HeroLetter.jsx          # Animated envelope & letter
    ├── AboutYou.jsx            # "Why You Are Special" card carousel
    ├── MyThoughts.jsx          # Personal message card
    ├── Gallery.jsx             # Polaroid photo gallery
    └── WishesClimax.jsx        # Grand finale with cutouts & confetti

public/
└── assets/
    ├── girl_cutout_1.png         # Large side cutout
    ├── girl_cutout_2.png         # Main center cutout
    ├── girl_cutout_3.png         # Third cutout (maroon jacket)
    ├── parallax_clouds_*.png     # Sky/clouds layer
    ├── parallax_mountains_*.png  # Mountains layer
    └── parallax_flowers_*.png    # Foreground flowers layer
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## 📝 Notes

- The app is designed for **full-screen** viewing (`h-screen`, `overflow-hidden`).
- Microphone permission is requested only when the user clicks "Make a wish & turn on Mic to blow!" — there is a tap/click fallback if permission is denied.
- Gallery images are sourced from Unsplash and load lazily.
- Avatar stickers in the AboutYou section are fetched from the DiceBear API.
