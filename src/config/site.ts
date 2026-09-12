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
  /** Shown in the homepage's featured trio, in this array's order. */
  pinned?: boolean
}

// The exact, ordered list of projects shown across the homepage and
// /projects — hand-curated (written from the actual repos/READMEs),
// including private repos GitHub's public API can't list. Add, remove, or
// reorder freely; this list is the whole source of truth, nothing gets
// added automatically. No `live` field on purpose — point people at the
// source instead of a deployment that might be sleeping/torn down.
export const allProjects: PinnedProject[] = [
  {
    repo: 'splendor',
    title: 'Splendor',
    description:
      'A Java implementation of the board game Splendor, with 1 shared rule engine powering both a console client and a web client, plus 3 tiers of AI opponents built with the Strategy pattern.',
    tags: ['Java', 'JavaScript', 'Docker', 'Game AI'],
    github: 'https://github.com/vanetiaho/splendor',
    pinned: true,
  },
  {
    repo: 'loanprocessingplatform',
    title: 'Loan.ly',
    description:
      'A microservices loan processing platform demonstrating 3 enterprise integration patterns. Orchestrated credit assessment, parallel-aggregated admin review, and event-driven repayment tracking. Built with 8 services behind a Kong API gateway, using REST, gRPC, and RabbitMQ.',
    tags: ['Python', 'JavaScript', 'Microservices', 'Docker', 'OutSystems'],
    github: 'https://github.com/vanetiaho/LoanProcessingPlatform',
    pinned: true,
  },
  {
    repo: 'wad22',
    title: 'Map N Mug',
    description:
      'A Vue + Supabase web app for finding study-friendly cafés. Filter by WiFi, noise, and outlet availability, with a live map, crowd-level updates, reviews, and a gamified rewards system.',
    tags: ['Vue', 'JavaScript', 'Supabase', 'Google Maps API'],
    github: 'https://github.com/vanetiaho/wad22',
    pinned: true,
  },
  {
    repo: 'dejaview',
    title: 'DejaView',
    description:
      'An AI-powered Chrome extension that passively tracks clothing you browse online, builds a personal fashion closet, and uses generative AI to recommend complementary outfits with virtual try-on.',
    tags: ['JavaScript', 'Chrome Extension', 'Generative AI'],
    github: 'https://github.com/vanetiaho/dejaview',
  },
]

// The featured trio shown on the homepage, in allProjects' order.
export const pinnedProjects: PinnedProject[] = allProjects.filter((p) => p.pinned)

export type FavoriteTrack = {
  title: string
  artist: string
  audioUrl?: string
  spotifyUrl?: string
  volume?: number
}

export const music: {
  featuredSpotifyUrl: string
  profileUrl: string
  favorites: FavoriteTrack[]
} = {
  // Paste any Spotify share link (track, album, or playlist) — open.spotify.com/...
  // It's converted into an embeddable player automatically.
  featuredSpotifyUrl: 'https://open.spotify.com/playlist/2cQi1uihMnjdxGBvbZSXY1?si=bef4044585c4421e',
  profileUrl: 'https://open.spotify.com/user/21p66homcn5dj3sbrmdlfhfwq',
  favorites: [
    { title: 'Separate Lives', artist: 'Phil Collins, Marilyn Martin', audioUrl: '/music/track-one.mp3' },
    { title: 'Make You Feel My Love', artist: 'Bob Dylan', audioUrl: '/music/track-two.mp3' },
    { title: "Love Me Like There's No Tomorrow", artist: 'Freddie Mercury', audioUrl: '/music/track-three.mp3' },
    { title: 'for lovers who hesitate', artist: 'JANNABI', audioUrl: '/music/track-four.mp3' },
    { title: '下凡', artist: 'Pets Tseng', audioUrl: '/music/track-five.mp3' },
  ],
}

export const github = {
  username: 'vanetiaho',
}
