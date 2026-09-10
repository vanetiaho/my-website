import { useEffect, useState } from 'react'
import { fetchGithubRepos, type GithubRepo } from '@/lib/github'
import { github } from '@/config/site'

type Status = 'unset' | 'loading' | 'ready' | 'error'

export function useGithubRepos() {
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const username = github.username
    if (!username || username.startsWith('[')) {
      setStatus('unset')
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8000)
    fetchGithubRepos(username, controller.signal)
      .then((data) => {
        setRepos(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error')
        else setStatus((s) => (s === 'loading' ? 'error' : s))
      })
      .finally(() => window.clearTimeout(timeout))

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return { repos, status }
}
