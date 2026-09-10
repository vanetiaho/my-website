// ============================================================================
// PERSONALIZE HERE — this is the single file to edit to make the site yours.
// Everything below flows into the navbar, hero, about, projects, music,
// GitHub graph, and contact pages.
// ============================================================================

export const profile = {
  name: 'vanetia',
  callsign: 'FL013', // shown in the footer, e.g. your initials or a cruising altitude
  role: 'Student',
  tagline: 'I build clean, fast interfaces and the systems behind them.',
  bio: `I'm a developer who likes the golden hour better than the neon — clear code,
  considered motion, and products that feel calm to use. Currently focused on
  [your focus, e.g. web platforms / distributed systems / creative frontend].`,
  location: 'Singapore',
  email: 'vangs.vanetia@gmail.com',
  avatarUrl: '', // optional headshot / illustration, leave blank for none
}

export const socials = {
  github: 'vanetiaho',
  linkedin: 'vanetia',
}

// Used only as a fallback if the live GitHub language fetch (below) fails or
// github.username isn't set — otherwise the About page shows real languages
// pulled straight from your public repos.
export const fallbackSkills = [
  'TypeScript',
  'JavaScript',
  'Python',
  'React',
  'Tailwind CSS',
  'Node.js',
  'PostgreSQL',
  'Docker',
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

// Used only as a fallback if the live GitHub repos fetch fails or
// github.username isn't set — otherwise /projects and the homepage preview
// pull real, up-to-date repos straight from your GitHub account.
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
  username: 'vanetiaho',
}
