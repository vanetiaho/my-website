# ✈ Sunset Flight Portfolio

A personal developer portfolio with a "golden hour on a runway" aesthetic — dark base UI,
sunset gradients, and light aviation motifs. Built with React, TypeScript, Tailwind CSS,
Framer Motion, React Three Fiber, GSAP, and Zustand.

## Tech stack

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** — styling
- **Framer Motion** — UI and page transitions
- **React Three Fiber + drei** — the 3D hero scene
- **GSAP + ScrollTrigger** — the scroll-driven flight-path indicator
- **Zustand** — entrance/session state
- **React Router** — `/`, `/projects`, `/music`, `/play`, `/contact`

## Getting started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build (tsc + vite build)
npm run preview   # preview the production build
```

## Make it yours

Almost everything personal lives in **one file**: [`src/config/site.ts`](src/config/site.ts).
Edit that to set:

- Your name, role, tagline, bio, location, email, resume link
- Social links (GitHub, LinkedIn, Twitter)
- Skills and proficiency levels
- Projects (title, description, tags, links)
- Music: a Spotify share link (track/album/playlist) for the embedded player, your
  Spotify profile link, and a list of favorite tracks for the carousel
- Your GitHub username, for the live contribution graph on `/projects`

No API keys or tokens required — the GitHub graph uses a public, unauthenticated endpoint
([github-contributions-api.jogruber.de](https://github-contributions-api.jogruber.de)) and
the music player uses Spotify's public embed iframe, so this works entirely client-side and
deploys as a static site (Vercel/Netlify/GitHub Pages).

### What I'd want from you to fully personalize this

- **Name, role/tagline, short bio, location, email**
- **GitHub username** — powers the contribution graph and project source links
- **Spotify** — a share link to a playlist/track you want featured, your profile link, and
  a handful of favorite tracks (title + artist, optionally their own Spotify links)
- **Social links** — LinkedIn / Twitter handles (or drop the ones you don't use)
- **Real projects** — title, one-line description, tags, GitHub/live links
- Optionally: a resume PDF link, and a headshot/illustration if you want an avatar

## Deploying

- **Vercel / Netlify**: point either at this repo, build command `npm run build`, output
  directory `dist`. No environment variables needed.
- **GitHub Pages**: a workflow is already set up at
  [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Since Pages serves from a
  repo subpath, it builds with `VITE_BASE_PATH=/<repo-name>/` — update that value in the
  workflow if your repo name changes.

## Project structure

```
src/
├── components/     # Cursor, Navbar, Entrance, FlightProgress, Vinyl, GithubCalendar, ...
├── config/         # site.ts — all personalization data
├── game/           # PlaneGame.tsx — the /play canvas mini-game
├── hooks/          # useReducedMotion, useIsTouchDevice
├── lib/            # small utilities (Spotify URL parsing, etc.)
├── pages/          # route-level components (Home, Projects, Music, Play, Contact)
├── scenes/         # HeroCanvas.tsx — the R3F 3D scene
├── sections/        # Home page sections (Hero, About, ProjectsPreview)
├── store/          # Zustand store
└── styles/         # Tailwind entry + global CSS
```

## Notes

- The entrance animation plays once per browser session (tracked via `sessionStorage`),
  and is skippable by click, scroll, or keypress.
- The 3D hero, the mini-game, and Spotify embed are all lazy-loaded so they don't block
  first paint.
- `prefers-reduced-motion` is respected throughout — the entrance, cursor trail, 3D
  parallax, and scroll indicator all fall back to static/instant behavior.
- The custom cursor and drag-to-rotate 3D scene automatically disable on touch devices.

Built with ♥ and ☕ at altitude.
