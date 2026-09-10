import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { github } from '@/config/site'

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

const LEVEL_COLORS = [
  'bg-white/5',
  'bg-sunset-plum/60',
  'bg-sunset-burnt/70',
  'bg-sunset-amber',
  'bg-sunset-gold',
]

function groupByWeek(days: Day[]): Day[][] {
  const weeks: Day[][] = []
  let current: Day[] = []
  days.forEach((day, i) => {
    const weekday = new Date(day.date).getUTCDay()
    if (i === 0) {
      for (let pad = 0; pad < weekday; pad++) {
        current.push({ date: '', count: 0, level: 0 })
      }
    }
    current.push(day)
    if (weekday === 6) {
      weeks.push(current)
      current = []
    }
  })
  if (current.length) weeks.push(current)
  return weeks
}

export default function GithubCalendar() {
  const [days, setDays] = useState<Day[] | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unset'>('loading')

  useEffect(() => {
    const username = github.username
    if (!username || username.startsWith('[')) {
      setStatus('unset')
      return
    }

    const controller = new AbortController()
    fetch(`https://github-contributions-api.jogruber.de/rest/v1/${username}?y=last`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('bad response')
        return res.json()
      })
      .then((data) => {
        setDays(data.contributions as Day[])
        setStatus('ready')
      })
      .catch(() => setStatus('error'))

    return () => controller.abort()
  }, [])

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
        Couldn't load the GitHub contribution graph right now — check the username in the
        config, or try again shortly.
      </div>
    )
  }

  if (status === 'loading' || !days) {
    return (
      <div className="glass-panel flex h-40 items-center justify-center rounded-2xl">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-sunset-amber/30 border-t-sunset-amber" />
      </div>
    )
  }

  const weeks = groupByWeek(days)
  const total = days.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="glass-panel overflow-x-auto rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-sm text-neutral-400">
          {total.toLocaleString()} contributions in the last year
        </p>
        <div className="flex items-center gap-1 text-[10px] text-neutral-500">
          <span>less</span>
          {LEVEL_COLORS.map((c, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
          ))}
          <span>more</span>
        </div>
      </div>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <motion.div
                key={di}
                title={day.date ? `${day.count} contributions on ${day.date}` : undefined}
                className={`h-2.5 w-2.5 rounded-sm ${day.date ? LEVEL_COLORS[day.level] : 'bg-transparent'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: (wi * 7 + di) * 0.001 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
