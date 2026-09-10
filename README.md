# ✈ Developer Portfolio

A **modern, dark, aviation-themed** personal developer portfolio built with React + Vite, deployed automatically to GitHub Pages via GitHub Actions.

## ✨ Features

- **Entrance screen** with animated runway & airplane takeoff
- **Floating pill navbar** with glassmorphism & active section tracking
- **Hero** with parallax airplane, typewriter titles, and sunset gradients
- **About** with skill tags, animated progress bars, and stats
- **Projects grid** with 3D tilt effect and filter
- **Flight Log** — GitHub contribution graph styled as an aviation logbook
- **Music section** with spinning vinyl record UI and Spotify link (no autoplay)
- **Hidden mini-game** — triple-click the hero airplane to unlock!
- **Contact form** with social links and aviation callsign footer
- **Custom cursor** with lag-ring follow effect
- Fully **responsive** (mobile, tablet, desktop)
- **Accessible** (ARIA labels, skip links, focus-visible, keyboard nav)
- **SEO** optimized with Open Graph tags

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 GitHub Pages Deployment

### One-time setup

1. **Update `vite.config.js`** — change `base` to match your repo name:
   ```js
   base: '/your-repo-name/',
   ```

2. **Enable GitHub Pages** in your repo:
   - Go to **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: `gh-pages` / `/ (root)`

3. **Push to `main`** — the GitHub Actions workflow deploys automatically!

### Manual deployment
```bash
npm run build
# Then push the dist/ folder to gh-pages branch
```

## 🎨 Personalizing

### Replace placeholders
Search for `[YOUR NAME]`, `[GITHUB]`, `[SPOTIFY]`, `[LINKEDIN]`, `[TWITTER]`, `[EMAIL]`, `[YOUR CITY]` and replace with your real info.

### Projects
Edit [`src/data/projects.js`](src/data/projects.js) to add your projects.

### Skills
Edit [`src/data/skills.js`](src/data/skills.js) to update your skills and proficiency levels.

### Music tracks
Edit the `TRACKS` array in [`src/components/Music/Music.jsx`](src/components/Music/Music.jsx).

### Design tokens
All colors and spacing are in [`src/styles/globals.css`](src/styles/globals.css) CSS custom properties.

## 🎮 Easter Egg

**Triple-click the airplane** in the hero section to unlock the hidden side-scrolling dodge game!

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 4 | Build tool |
| CSS (custom properties) | Styling — no framework |
| GitHub Actions | CI/CD |
| GitHub Pages | Hosting |

## 📁 Project Structure

```
src/
├── components/
│   ├── Cursor/        # Custom cursor
│   ├── Entrance/      # Landing screen
│   ├── Navbar/        # Floating pill nav
│   ├── Hero/          # Hero + parallax plane
│   ├── About/         # Bio + skills
│   ├── Projects/      # Project grid
│   ├── FlightLog/     # GitHub contribution graph
│   ├── Music/         # Vinyl record + tracks
│   ├── MiniGame/      # Hidden canvas game
│   └── Contact/       # Contact form + footer
├── data/
│   ├── projects.js    # Centralized project data
│   └── skills.js      # Centralized skills data
└── styles/
    ├── globals.css    # Design tokens + resets
    └── animations.css # Keyframe library
```

---

Built with ♥ and ☕ at altitude.
