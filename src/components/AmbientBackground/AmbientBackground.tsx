import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// A tiny tiled SVG noise texture — adds grain so the dark base never reads as
// a flat, dead black, without shipping an image asset.
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

type Blob = {
  className: string
  color: string
  size: string
  from: { x: string; y: string }
  to: { x: string; y: string }
  duration: number
}

const BLOBS: Blob[] = [
  {
    className: 'left-[-10%] top-[-10%]',
    color: 'rgba(74,37,69,0.45)',
    size: '46vw',
    from: { x: '0%', y: '0%' },
    to: { x: '6%', y: '8%' },
    duration: 34,
  },
  {
    className: 'right-[-15%] top-[15%]',
    color: 'rgba(193,80,46,0.28)',
    size: '52vw',
    from: { x: '0%', y: '0%' },
    to: { x: '-8%', y: '10%' },
    duration: 42,
  },
  {
    className: 'left-[10%] bottom-[-20%]',
    color: 'rgba(25,27,58,0.55)',
    size: '50vw',
    from: { x: '0%', y: '0%' },
    to: { x: '5%', y: '-6%' },
    duration: 38,
  },
]

/** Mounted once at the app root: slow drifting glows + film grain so every
 *  page has quiet depth instead of a flat black canvas. Fixed and inert —
 *  never intercepts input, never competes with foreground content. */
export default function AmbientBackground() {
  const reduced = useReducedMotion()

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-base-950" />
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[100px] ${blob.className}`}
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
          }}
          initial={blob.from}
          animate={
            reduced
              ? blob.from
              : { x: [blob.from.x, blob.to.x, blob.from.x], y: [blob.from.y, blob.to.y, blob.from.y] }
          }
          transition={
            reduced
              ? undefined
              : { duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      ))}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN_URL}")`, backgroundSize: '160px 160px' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950/60" />
    </div>
  )
}
