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
    repo: 'hackforhumanity',
    title: 'Buddi',
    description:
      "A healthcare app designed to support people with anorexia during meals. Patients can choose a 3D companion whose appearance changes based on their engagement, without using calories, scores, or punishment. The app also includes a clinician dashboard with AI-assisted meal reviews and care reminders.",
    tags: ['React', 'Expo', 'AI'],
    github: 'https://github.com/yinasaurus/hack-for-humanity',
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
    repo: 'splendor',
    title: 'Splendor',
    description:
      'A Java implementation of the board game Splendor, with 1 shared rule engine powering both a console client and a web client, plus 3 tiers of AI opponents built with the Strategy pattern.',
    tags: ['Java', 'JavaScript', 'Docker', 'AI'],
    github: 'https://github.com/vanetiaho/splendor',
    pinned: true,
  },
  {
    repo: 'ewaste',
    title: 'ChipCycle',
    description:
      'A platform that helps reduce e-waste by giving used laptops a fair market price using a Random Forest model. It also recommends suitable tech products, such as desktop parts, keyboards, phones, and iPads, based on what users need and their budget. The system uses a React chat interface connected to a Flask backend.',
    tags: ['Python', 'Flask', 'React', 'Machine Learning'],
    github: 'https://github.com/yinasaurus/e-waste',
  },
  {
    repo: 'wad22',
    title: 'Map N Mug',
    description:
      'A Vue + Supabase web app for finding study-friendly cafés. Filter by WiFi, noise, and outlet availability, with a live map, crowd-level updates, reviews, and a gamified rewards system.',
    tags: ['Vue', 'JavaScript', 'Supabase', 'Google Maps API'],
    github: 'https://github.com/vanetiaho/wad22',
  },
  {
    repo: 'dejaview',
    title: 'DejaView',
    description:
      'An AI-powered Chrome extension that passively tracks clothing you browse online, builds a personal fashion closet, and uses generative AI to recommend complementary outfits with virtual try-on.',
    tags: ['JavaScript', 'Chrome Extension', 'AI'],
    github: 'https://github.com/vanetiaho/dejaview',
  },
]

// The featured trio shown on the homepage, in allProjects' order.
export const pinnedProjects: PinnedProject[] = allProjects.filter((p) => p.pinned)

export type Track = {
  title: string
  artist: string
  // A favorite plays whichever of these it has: a local file under
  // /public/music, or (if no local file) a link out to the track on
  // Spotify. `volume` lets a too-loud/quiet master be balanced against
  // the others (0–1, defaults to 0.55).
  audioUrl?: string
  spotifyUrl?: string
  volume?: number
}

export const music = {
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
  ] as Track[],
}

export const github = {
  username: 'vanetiaho',
}
