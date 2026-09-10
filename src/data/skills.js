// Centralized skills data — update with your actual skill levels
export const skillCategories = [
  {
    category: 'Languages',
    icon: '< >',
    skills: [
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Python', level: 80 },
      { name: 'Go', level: 65 },
      { name: 'SQL', level: 78 },
    ],
  },
  {
    category: 'Frontend',
    icon: '◈',
    skills: [
      { name: 'React', level: 92 },
      { name: 'Vue.js', level: 75 },
      { name: 'CSS / SCSS', level: 88 },
      { name: 'Next.js', level: 80 },
      { name: 'Three.js', level: 60 },
    ],
  },
  {
    category: 'Backend',
    icon: '⬡',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'FastAPI', level: 78 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'Redis', level: 70 },
      { name: 'GraphQL', level: 65 },
    ],
  },
  {
    category: 'DevOps & Tools',
    icon: '⚙',
    skills: [
      { name: 'Docker', level: 80 },
      { name: 'Git', level: 90 },
      { name: 'GitHub Actions', level: 78 },
      { name: 'AWS', level: 65 },
      { name: 'Linux', level: 75 },
    ],
  },
]

// Flat list of all skill tags for the About section
export const skillTags = [
  'JavaScript', 'TypeScript', 'Python', 'Go',
  'React', 'Vue.js', 'Next.js', 'CSS',
  'Node.js', 'FastAPI', 'PostgreSQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'GitHub Actions',
  'Git', 'REST APIs', 'GraphQL', 'Linux',
  'Three.js', 'WebSocket', 'PWA', 'Vite',
]
