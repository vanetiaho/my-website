export type GithubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  fork: boolean
  archived: boolean
  topics?: string[]
  pushed_at: string
}

/** Fetches a user's public, non-fork, non-archived repos (unauthenticated GitHub API). */
export async function fetchGithubRepos(
  username: string,
  signal?: AbortSignal
): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
    { signal, headers: { Accept: 'application/vnd.github+json' } }
  )
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const data = (await res.json()) as GithubRepo[]
  return data.filter((r) => !r.fork && !r.archived)
}

/** Ranks a user's primary languages by how many of their repos use them. */
export function languagesFromRepos(repos: GithubRepo[]): string[] {
  const counts = new Map<string, number>()
  for (const repo of repos) {
    if (!repo.language) continue
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)
}

function titleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export type DisplayProject = {
  id: string
  repo: string
  title: string
  description: string
  tags: string[]
  github?: string
}

export function reposToProjects(repos: GithubRepo[]): DisplayProject[] {
  return repos
    .slice()
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .map((repo) => ({
      id: String(repo.id),
      repo: repo.name,
      title: titleCase(repo.name),
      description: repo.description || 'No description yet — check the repo for details.',
      tags: [repo.language, ...(repo.topics ?? [])].filter((t): t is string => Boolean(t)).slice(0, 4),
      github: repo.html_url,
    }))
}

/**
 * Merges hand-curated project data (better descriptions, private repos GitHub's
 * public API can't see) with the live-fetched public repo list. A pinned entry
 * whose repo also appears in `fetched` overrides that entry's title/description/
 * tags; a pinned entry with no match (e.g. a private repo) is listed on its own,
 * first.
 */
export function mergeWithPinned<T extends { repo: string; title: string; description: string; tags: string[]; github: string }>(
  fetched: DisplayProject[],
  pinned: T[]
): DisplayProject[] {
  const fetchedRepoNames = new Set(fetched.map((p) => p.repo.toLowerCase()))
  const merged = fetched.map((p) => {
    const pin = pinned.find((x) => x.repo.toLowerCase() === p.repo.toLowerCase())
    return pin ? { ...p, title: pin.title, description: pin.description, tags: pin.tags } : p
  })
  const pinnedOnly = pinned
    .filter((p) => !fetchedRepoNames.has(p.repo.toLowerCase()))
    .map((p) => ({
      id: p.repo,
      repo: p.repo,
      title: p.title,
      description: p.description,
      tags: p.tags,
      github: p.github,
    }))
  return [...pinnedOnly, ...merged]
}
