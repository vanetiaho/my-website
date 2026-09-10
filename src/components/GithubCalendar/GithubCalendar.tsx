import { useState } from 'react'
import { github } from '@/config/site'

type Status = 'loading' | 'ready' | 'error' | 'unset'

export default function GithubCalendar() {
  const usernameSet = Boolean(github.username) && !github.username.startsWith('[')
  const [status, setStatus] = useState<Status>(usernameSet ? 'loading' : 'unset')

  if (status === 'unset') {
    return (
      <div className="glass-panel rounded-2xl p-6 text-sm text-neutral-500">
        Add your GitHub username to{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sunset-amber">
          src/config/site.ts
        </code>{' '}
        to show your live contribution graph here.
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="glass-panel rounded-2xl p-6 text-sm text-neutral-500">
        Couldn't load the GitHub contribution graph right now — it may just be a slow
        connection. Refresh to try again.
      </div>
    )
  }

  return (
    <div className="glass-panel overflow-x-auto rounded-2xl p-6">
      {status === 'loading' && (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-sunset-amber/30 border-t-sunset-amber" />
        </div>
      )}
      <img
        src={`https://ghchart.rshah.org/e8934a/${github.username}`}
        alt={`${github.username}'s GitHub contribution graph`}
        className={status === 'ready' ? 'w-full min-w-[640px]' : 'hidden'}
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('error')}
      />
    </div>
  )
}
