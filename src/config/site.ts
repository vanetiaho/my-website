// ============================================================================
// PERSONALIZE HERE — this is the single file to edit to make the site yours.
// Everything below flows into the navbar, hero, about, projects, music,
// GitHub graph, and contact pages.
// ============================================================================

export const profile = {
  name: '[Your Name]',
  callsign: 'FL390', // shown in the footer, e.g. your initials or a cruising altitude
  role: 'Full-Stack Developer',
  tagline: 'I build clean, fast interfaces and the systems behind them.',
  bio: `I'm a developer who likes the golden hour better than the neon — clear code,
  considered motion, and products that feel calm to use. Currently focused on
  [your focus, e.g. web platforms / distributed systems / creative frontend].`,
  location: '[Your City, Country]',
  email: '[you@example.com]',
  resumeUrl: '', // link to a hosted PDF, or leave blank to hide the button
  avatarUrl: '', // optional headshot / illustration, leave blank for none
}

export const socials = {
  github: '[your-github-username]',
  linkedin: '[your-linkedin-handle]',
  twitter: '[your-twitter-handle]',
}

export const skillCategories = [
  {
    category: 'Languages',
    skills: [
      { name: 'TypeScript', level: 88 },
      { name: 'JavaScript', level: 90 },
      { name: 'Python', level: 75 },
      { name: 'SQL', level: 78 },
    ],
  },
  {
    category: 'Frontend',
    skills: [
      { name: 'React', level: 92 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'Three.js / R3F', level: 60 },
      { name: 'Next.js', level: 78 },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'PostgreSQL', level: 78 },
      { name: 'REST / GraphQL APIs', level: 80 },
      { name: 'Docker', level: 70 },
    ],
  },
]

export type Project = {
  id: string
  title: string
  description: string
  tags: string[]
  github?: string
  live?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'project-alpha',
    title: '[Project Alpha]',
    description:
      'A full-stack web application for [use case] — real-time data, responsive UI, scalable backend.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    github: 'https://github.com/[your-github-username]/project-alpha',
    live: '',
    featured: true,
  },
  {
    id: 'project-beta',
    title: '[Project Beta]',
    description: 'A pipeline / tool for [problem], with automated processing and a clean API.',
    tags: ['Python', 'FastAPI', 'Docker'],
    github: 'https://github.com/[your-github-username]/project-beta',
    live: '',
    featured: true,
  },
  {
    id: 'project-gamma',
    title: '[Project Gamma]',
    description: 'A mobile-first progressive web app for [purpose], optimized and offline-capable.',
    tags: ['React', 'PWA', 'Tailwind'],
    github: 'https://github.com/[your-github-username]/project-gamma',
    live: '',
    featured: false,
  },
  {
    id: 'project-delta',
    title: '[Project Delta]',
    description: 'A CLI tool automating [workflow], saving hours per week.',
    tags: ['Go', 'CLI', 'GitHub API'],
    github: 'https://github.com/[your-github-username]/project-delta',
    live: '',
    featured: false,
  },
]

export const music = {
  // Paste any Spotify share link (track, album, or playlist) — open.spotify.com/...
  // It's converted into an embeddable player automatically.
  featuredSpotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
  profileUrl: 'https://open.spotify.com/user/[your-spotify-username]',
  favorites: [
    { title: '[Track One]', artist: '[Artist]', spotifyUrl: '' },
    { title: '[Track Two]', artist: '[Artist]', spotifyUrl: '' },
    { title: '[Track Three]', artist: '[Artist]', spotifyUrl: '' },
    { title: '[Track Four]', artist: '[Artist]', spotifyUrl: '' },
    { title: '[Track Five]', artist: '[Artist]', spotifyUrl: '' },
  ],
}

export const github = {
  username: '[your-github-username]',
}
