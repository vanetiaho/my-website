// ============================================================================
// PERSONALIZE HERE — this is the single file to edit to make the site yours.
// Everything below flows into the navbar, hero, about, projects, music,
// GitHub graph, and contact pages.
// ============================================================================

export const profile = {
  name: 'vanetia h.',
  callsign: 'FL013', // shown in the footer, e.g. your initials or a cruising altitude
  role: 'jobless otter',
  tagline: 'professionally going with the flow.',
  bio: `In my “let’s see where this goes” era: learning new things, building little ideas, and collecting experiences along the way. I’m easily distracted by pretty sunsets, planes in the sky, a good soundtrack, and stories I tell myself I’ll watch just one episode of.`,
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
  repo: string
  title: string
  description: string
  tags: string[]
  github: string
}

// The exact, ordered list of projects shown on the homepage and /projects —
// hand-curated (written from the actual repos/READMEs), including private
// repos GitHub's public API can't list. Add, remove, or reorder freely; this
// list is the whole source of truth, nothing gets added automatically.
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
    repo: 'loanprocessingplatform',
    title: 'Loan.ly',
    description:
      'A microservices loan processing platform demonstrating three enterprise integration patterns — orchestrated credit assessment, parallel-aggregated admin review, and event-driven repayment tracking — across 8 services behind a Kong API gateway, using REST, gRPC, and RabbitMQ.',
    tags: ['Python', 'JavaScript', 'Microservices', 'Docker', 'OutSystems'],
    github: 'https://github.com/vanetiaho/LoanProcessingPlatform',
  },
  {
    repo: 'wad22',
    title: 'Map N Mug',
    description:
      'A Vue + Supabase web app for finding study-friendly cafés — filter by WiFi, noise, and outlet availability, with a live map, crowd-level updates, reviews, and a gamified rewards system.',
    tags: ['Vue', 'JavaScript', 'Supabase', 'Google Maps API'],
    github: 'https://github.com/vanetiaho/wad22',
  },
]

export const music = {
  // Paste any Spotify share link (track, album, or playlist) — open.spotify.com/...
  // It's converted into an embeddable player automatically.
  featuredSpotifyUrl: 'https://open.spotify.com/playlist/4d14FSQi5XrsuuJntZycMC?si=de65551b72ae4468',
  profileUrl: 'https://open.spotify.com/user/21p66homcn5dj3sbrmdlfhfwq',
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
