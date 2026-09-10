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

// The languages/tools shown on the About page — edit this list directly,
// it's yours to curate.
export const skills = [
  'Python',
  'Java',
  'JavaScript',
  'PHP',
  'Vue.js',
  'MySQL',
  'Supabase',
  'AWS',
  'Docker',
  'Figma',
]

export type PinnedProject = {
  // Must match the GitHub repo name (case-insensitive) so it can be merged
  // with — or override the description/tags of — the live-fetched version.
  repo: string
  title: string
  description: string
  tags: string[]
  github: string
}

// Hand-curated projects — written from the actual repos/READMEs. These are
// always shown: a pinned entry whose `repo` also shows up in your public
// GitHub repos gets its title/description/tags merged in there; one that
// doesn't (e.g. a private repo GitHub's public API can't see) is still
// listed on its own. This is also what's shown if the live fetch fails.
// No `live` field on purpose — point people at the source instead of a
// deployment that might be sleeping/torn down.
export const pinnedProjects: PinnedProject[] = [
  {
    repo: 'splendor',
    title: 'Splendor',
    description:
      'A Java implementation of the board game Splendor, with one shared rule engine powering both a console client and a web client, plus three tiers of AI opponents (easy/medium/hard) built with the Strategy pattern.',
    tags: ['Java', 'JavaScript', 'Docker', 'Game AI'],
    github: 'https://github.com/vanetiaho/splendor',
  },
  {
    repo: 'wad22',
    title: 'Map N Mug',
    description:
      'A Vue + Supabase web app for finding study-friendly cafés — filter by WiFi, noise, and outlet availability, with a live map, crowd-level updates, reviews, and a gamified rewards system.',
    tags: ['Vue', 'JavaScript', 'Supabase', 'Google Maps API'],
    github: 'https://github.com/vanetiaho/wad22',
  },
  {
    repo: 'loanprocessingplatform',
    title: 'Loan.ly',
    description:
      'A microservices loan processing platform demonstrating three enterprise integration patterns — orchestrated credit assessment, parallel-aggregated admin review, and event-driven repayment tracking — across 8 services behind a Kong API gateway, using REST, gRPC, and RabbitMQ.',
    tags: ['Python', 'JavaScript', 'Microservices', 'Docker', 'OutSystems'],
    github: 'https://github.com/vanetiaho/LoanProcessingPlatform',
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
  // Repo names (case-insensitive) to leave out of the live-fetched project
  // list — this portfolio's own repo and your profile-README repo aren't
  // projects.
  excludedRepos: ['my-website', 'vanetiaho'],
}
