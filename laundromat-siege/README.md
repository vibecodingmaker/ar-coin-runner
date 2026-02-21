# 🫧 Laundromat Siege - Suds & Scum Defense

A unique tower defense game where you defend your laundromat from waves of dirty laundry monsters!

## 🎮 Game Concept

In a bustling city laundromat cursed by an ancient "Filth Spirit," everyday clothes and linens come alive as monstrous invaders. You're the overworked laundromat owner, armed with industrial washers, dryers, and cleaning gadgets to defend your shop from escalating waves of grimy horrors.

**Slogan:** "Wash away the waves before the scum overflows!"

## 🚀 Development Status

- **Day 1 (Stage 1):** ✅ Foundation Setup
  - Project structure
  - Basic Phaser.js integration
  - Tower placement system
  - Enemy spawning and pathfinding
  - Wave management
  - Cleanse meter mechanic

## 🛠️ Tech Stack

- **Engine:** Phaser 3
- **Language:** JavaScript (ES6+)
- **Bundler:** Vite
- **Packaging:** Electron (for Steam release)
- **Deployment:** Netlify

## 📁 Project Structure

```
laundromat-siege/
├── src/
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MainMenuScene.js
│   │   └── GameScene.js
│   ├── entities/
│   │   ├── Tower.js
│   │   └── Enemy.js
│   ├── utils/
│   │   ├── Pathfinding.js
│   │   └── WaveManager.js
│   └── main.js
├── electron/
│   └── main.js
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Core Mechanics

### Towers (5 Types)
1. 🧼 **Soap Blaster** - Basic ranged tower
2. 🔄 **Spin Cycle** - Melee AoE trap
3. 🔥 **Dryer Cannon** - Ranged AoE with DoT
4. ⚡ **Iron Press** - High damage single-target
5. 🚁 **Detergent Drone** - Flying support unit

### Enemies (6 Types)
1. 🧦 **Rogue Socks** - Fast scouts
2. 🌪️ **Lint Golems** - Flying units
3. 🐌 **Stain Slugs** - Tanky with corrosive trail
4. 🧺 **Laundry Baskets** - Carriers
5. 👕 **Shrunk Shirts** - Stealth units
6. 🦹 **Filth Lord Washer** - Boss

### Unique Features
- **Cleanse Meter:** Towers build soap charge for AoE stun
- **Flooding:** Leaking pipes create dynamic obstacles
- **Eco-Recycling:** Turn defeated enemies into buffs

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for web
npm run build

# Package for desktop (Steam)
npm run package
```

## 📅 Development Roadmap

- [x] Day 1: Project foundation and basic mechanics
- [ ] Day 2: Tower variety and upgrades
- [ ] Day 3: Enemy types and behaviors
- [ ] Day 4: Map designs and pathfinding
- [ ] Day 5: Audio and visual effects
- [ ] Day 6: UI polish and menus
- [ ] Day 7: Steam integration and testing

## 🎨 Assets

- Placeholder graphics generated programmatically
- Final assets will be AI-generated (Midjourney/DALL-E)
- 32x32 pixel art style

## 📄 License

MIT License - See LICENSE file
