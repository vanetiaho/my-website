import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { github } from '@/config/site'

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
type Status = 'loading' | 'ready' | 'image-fallback' | 'error' | 'unset'

const API_URL = (username: string) =>
  `https://github-contributions-api.jogruber.de/rest/v1/${username}?y=last`

function isValidPayload(data: unknown): data is { contributions: Day[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as { contributions?: unknown }).contributions)
  )
}

/** Fetches once with a timeout; retries a single time after a short delay
 *  before giving up, since the third-party API is occasionally just slow
 *  rather than actually down. */
async function fetchContributions(username: string, attempt = 0): Promise<Day[]> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 9000)
  try {
    const res = await fetch(API_URL(username), { signal: controller.signal })
    if (!res.ok) throw new Error(`bad response: ${res.status}`)
    const data = await res.json()
    if (!isValidPayload(data)) throw new Error('unexpected payload shape')
    return data.contributions
  } catch (err) {
    if (attempt === 0) {
      await new Promise((r) => window.setTimeout(r, 1000))
      return fetchContributions(username, attempt + 1)
    }
    throw err
  } finally {
    window.clearTimeout(timeout)
  }
}

// Glass "tiles" — an inset highlight on top + a soft shadow below, amber glow
// on the brighter levels so it reads like backlit glass rather than flat pixels.
const LEVEL_STYLES = [
  {
    background: 'rgba(255,255,255,0.05)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -1px 2px rgba(0,0,0,0.25)',
  },
  {
    background: 'linear-gradient(160deg, rgba(74,37,69,0.9), rgba(74,37,69,0.55))',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.25)',
  },
  {
    background: 'linear-gradient(160deg, rgba(193,80,46,0.95), rgba(193,80,46,0.65))',
    boxShadow:
      'inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.25), 0 0 6px rgba(193,80,46,0.35)',
  },
  {
    background: 'linear-gradient(160deg, #e8934a, #c1682f)',
    boxShadow:
      'inset 0 1px 1.5px rgba(255,255,255,0.35), inset 0 -1px 2px rgba(0,0,0,0.2), 0 0 8px rgba(232,147,74,0.45)',
  },
  {
    background: 'linear-gradient(160deg, #f9d599, #f4b860)',
    boxShadow:
      'inset 0 1px 1.5px rgba(255,255,255,0.55), inset 0 -1px 2px rgba(0,0,0,0.15), 0 0 12px rgba(244,184,96,0.65)',
  },
]

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
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

function monthLabelsFor(weeks: Day[][]): (string | null)[] {
  let lastMonth = -1
  return weeks.map((week) => {
    const firstRealDay = week.find((d) => d.date)
    if (!firstRealDay) return null
    const month = new Date(firstRealDay.date).getUTCMonth()
    if (month === lastMonth) return null
    lastMonth = month
    return MONTHS[month]
  })
}

export default function GithubCalendar() {
  const usernameSet = Boolean(github.username) && !github.username.startsWith('[')
  const [days, setDays] = useState<Day[] | null>(null)
  const [status, setStatus] = useState<Status>(usernameSet ? 'loading' : 'unset')

  useEffect(() => {
    if (!usernameSet) return
    let cancelled = false

    fetchContributions(github.username)
      .then((contributions) => {
        if (cancelled) return
        setDays(contributions)
        setStatus('ready')
      })
      .catch(() => {
        // The JSON API (with a retry already spent) is down or blocked —
        // fall back to a plain <img>, which loads without CORS/fetch at all
        // and is far less likely to fail the same way.
        if (!cancelled) setStatus('image-fallback')
      })

    return () => {
      cancelled = true
    }
  }, [usernameSet])

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

  if (status === 'image-fallback') {
    return (
      <div
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl"
        style={{
          boxShadow:
            'inset 0 1px 1px rgba(255,255,255,0.08), inset 0 -1px 12px rgba(0,0,0,0.25), 0 20px 40px -20px rgba(0,0,0,0.5)',
        }}
      >
        <p className="mb-4 font-mono text-sm text-neutral-400">
          contributions on <span className="text-sunset-gold">github</span>
        </p>
        <div className="overflow-x-auto rounded-xl bg-[#f4e9dd] p-3">
          <img
            src={`https://ghchart.rshah.org/e8934a/${github.username}`}
            alt={`${github.username}'s GitHub contribution graph`}
            className="min-w-[640px]"
            loading="lazy"
            onError={() => setStatus('error')}
          />
        </div>
        <a
          href={`https://github.com/${github.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="interactive mt-4 inline-flex items-center gap-1 font-mono text-xs text-neutral-500 hover:text-sunset-gold"
        >
          View full profile on GitHub ↗
        </a>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="glass-panel rounded-2xl p-6 text-sm text-neutral-500">
        Couldn't load the GitHub contribution graph right now.{' '}
        <a
          href={`https://github.com/${github.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="interactive text-sunset-gold hover:underline"
        >
          View it directly on GitHub ↗
        </a>
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
  const monthLabels = monthLabelsFor(weeks)
  const total = days.reduce((sum, d) => sum + d.count, 0)

  return (
    <div
      className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl"
      style={{
        boxShadow:
          'inset 0 1px 1px rgba(255,255,255,0.08), inset 0 -1px 12px rgba(0,0,0,0.25), 0 20px 40px -20px rgba(0,0,0,0.5)',
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="font-mono text-sm text-neutral-400">
          <span className="text-sunset-gold">{total.toLocaleString()}</span> contributions in
          the last year
        </p>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-neutral-500">
          <span>less</span>
          {LEVEL_STYLES.map((style, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-[3px]" style={style} />
          ))}
          <span>more</span>
        </div>
      </div>

      <div className="min-w-[640px]">
        <div className="mb-1 flex gap-[3px] pl-0 font-mono text-[10px] text-neutral-500">
          {monthLabels.map((label, i) => (
            <span key={i} className="w-[13px] shrink-0">
              {label}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <motion.div
                  key={di}
                  title={day.date ? `${day.count} contributions on ${day.date}` : undefined}
                  className={`h-[13px] w-[13px] rounded-[3px] transition-transform duration-150 ${
                    day.date ? 'hover:scale-125' : ''
                  }`}
                  style={day.date ? LEVEL_STYLES[day.level] : { background: 'transparent' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: (wi * 7 + di) * 0.0008 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
