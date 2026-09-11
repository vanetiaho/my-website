import { useEffect, useMemo, useRef, useState } from 'react'
import { useAnimationFrame } from 'framer-motion'
import { github } from '@/config/site'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import PlaneIcon from '@/components/icons/PlaneIcon'

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
type Week = { start: string; end: string; total: number; level: 0 | 1 | 2 | 3 | 4 }
type Status = 'loading' | 'ready' | 'error' | 'unset'

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

// Runway-light colors by activity level — dim white through hot amber.
const LEVEL_COLOR = ['rgba(255,255,255,0.15)', '#7a5a8a', '#c1682f', '#e8934a', '#f9d599']
const LEVEL_RADIUS = [2.5, 3.5, 4.5, 5.5, 6.5]

const DATE_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function groupByWeek(days: Day[]): Day[][] {
  const weeks: Day[][] = []
  let current: Day[] = []
  days.forEach((day, i) => {
    const weekday = new Date(day.date).getUTCDay()
    if (i === 0) {
      for (let pad = 0; pad < weekday; pad++) current.push({ date: '', count: 0, level: 0 })
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

function toWeeklyTotals(days: Day[]): Week[] {
  const dayWeeks = groupByWeek(days)
  const raw = dayWeeks.map((week) => {
    const real = week.filter((d) => d.date)
    const total = real.reduce((sum, d) => sum + d.count, 0)
    return { start: real[0]?.date ?? '', end: real[real.length - 1]?.date ?? '', total }
  })
  const max = Math.max(1, ...raw.map((w) => w.total))
  return raw.map((w) => {
    const ratio = w.total / max
    const level: Week['level'] = w.total === 0 ? 0 : ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1
    return { ...w, level }
  })
}

const STEP = 26
const MARGIN = 20
const HEIGHT = 130
const BASELINE = 70
const AMPLITUDE = 22
const FREQ = 0.018

function waveY(x: number) {
  return BASELINE + Math.sin(x * FREQ) * AMPLITUDE
}

function FlightPath({ weeks }: { weeks: Week[] }) {
  const reduced = useReducedMotion()
  const planeRef = useRef<SVGGElement>(null)
  const width = MARGIN * 2 + weeks.length * STEP

  const pathD = useMemo(() => {
    const points: string[] = []
    for (let x = 0; x <= width; x += 6) {
      points.push(`${x === 0 ? 'M' : 'L'} ${x},${waveY(x).toFixed(1)}`)
    }
    return points.join(' ')
  }, [width])

  const markers = useMemo(
    () =>
      weeks.map((week, i) => {
        const x = MARGIN + i * STEP + STEP / 2
        const y = waveY(x) - week.level * 3.2
        return { ...week, x, y }
      }),
    [weeks]
  )

  useAnimationFrame((time) => {
    if (reduced || !planeRef.current) return
    const LOOP_MS = 16000
    const t = (time % LOOP_MS) / LOOP_MS
    const x = t * width
    const y = waveY(x)
    const slope = waveY(x + 3) - waveY(x - 3)
    const angle = Math.atan2(slope, 6) * (180 / Math.PI)
    planeRef.current.setAttribute('transform', `translate(${x}, ${y}) rotate(${angle})`)
  })

  return (
    <svg
      width={width}
      height={HEIGHT}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      className="block"
      role="img"
      aria-label="GitHub contribution flight path, one waypoint per week"
    >
      <defs>
        <linearGradient id="flight-path-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a2545" />
          <stop offset="50%" stopColor="#c1502e" />
          <stop offset="100%" stopColor="#f4b860" />
        </linearGradient>
      </defs>

      {/* dashed route line */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#flight-path-line)"
        strokeWidth={1.5}
        strokeDasharray="1 7"
        strokeLinecap="round"
        opacity={0.5}
      />

      {/* activity waypoints */}
      {markers.map((m, i) => (
        <g key={i}>
          {m.level > 0 && (
            <circle cx={m.x} cy={m.y} r={LEVEL_RADIUS[m.level] + 4} fill={LEVEL_COLOR[m.level]} opacity={0.18} />
          )}
          <circle
            cx={m.x}
            cy={m.y}
            r={LEVEL_RADIUS[m.level]}
            fill={LEVEL_COLOR[m.level]}
            stroke={m.level > 0 ? 'rgba(255,255,255,0.4)' : 'transparent'}
            strokeWidth={0.5}
            className="transition-[r] duration-150 hover:opacity-80"
          >
            {m.start && (
              <title>
                {m.total} contribution{m.total === 1 ? '' : 's'} · week of {DATE_FMT.format(new Date(m.start))}
              </title>
            )}
          </circle>
        </g>
      ))}

      {/* the plane, continuously flying the route */}
      <g ref={planeRef} transform={`translate(${reduced ? width / 2 : 0}, ${waveY(width / 2)})`}>
        <circle r={9} fill="rgba(244,184,96,0.25)" />
        <foreignObject x={-9} y={-9} width="18" height="18">
          <PlaneIcon
            className="block text-lg leading-none text-sunset-gold"
          />
        </foreignObject>
      </g>
    </svg>
  )
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
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [usernameSet])

  const panelClass =
    'rounded-2xl border border-white/10 bg-gradient-to-b from-base-900 to-base-950 p-6'
  const panelShadow = {
    boxShadow:
      'inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -1px 16px rgba(0,0,0,0.4), 0 20px 40px -20px rgba(0,0,0,0.6)',
  }

  if (status === 'unset') {
    return (
      <div className={`${panelClass} text-sm text-neutral-500`} style={panelShadow}>
        Add your GitHub username to{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sunset-amber">
          src/config/site.ts
        </code>{' '}
        to show your live activity here.
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={`${panelClass} text-sm text-neutral-500`} style={panelShadow}>
        Couldn't load the flight log right now.{' '}
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
      <div className={`${panelClass} flex h-40 items-center justify-center`} style={panelShadow}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-sunset-amber/30 border-t-sunset-amber" />
      </div>
    )
  }

  const weeks = toWeeklyTotals(days)
  const total = days.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className={`${panelClass} overflow-x-auto`} style={panelShadow}>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-sm text-neutral-400">
          <span className="text-sunset-gold">{total.toLocaleString()}</span> contributions logged
          this year
        </p>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-neutral-500">
          <span>quiet</span>
          {LEVEL_COLOR.map((color, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ background: color, boxShadow: i > 1 ? `0 0 6px ${color}` : undefined }}
            />
          ))}
          <span>busy</span>
        </div>
      </div>
      <FlightPath weeks={weeks} />
    </div>
  )
}
