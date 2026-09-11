import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
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

type Cloud = {
  top: string
  width: string
  height: string
  opacity: number
  duration: number
  parallax: number
  reverse?: boolean
}

// Soft, hazy streaks rather than literal cloud puffs — reads as light passing
// through high atmosphere, drifting at different speeds for depth, like
// looking out a plane window at cloud layers below.
const CLOUDS: Cloud[] = [
  { top: '8%', width: '55vw', height: '14vw', opacity: 0.05, duration: 85, parallax: 40 },
  { top: '38%', width: '70vw', height: '10vw', opacity: 0.035, duration: 120, parallax: 90, reverse: true },
  { top: '68%', width: '46vw', height: '16vw', opacity: 0.045, duration: 100, parallax: 60 },
]

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

/** A single hazy cloud streak, drifting slowly across and shifting with
 *  scroll depth — layers at different `parallax` speeds read as distance,
 *  like cloud banks seen through a plane window. */
function CloudLayer({
  cloud,
  scrollY,
  reduced,
}: {
  cloud: Cloud
  scrollY: MotionValue<number>
  reduced: boolean
}) {
  const y = useTransform(scrollY, (v) => -(v / 1000) * cloud.parallax)

  return (
    <motion.div
      className="absolute rounded-[50%] blur-3xl"
      style={{
        top: cloud.top,
        width: cloud.width,
        height: cloud.height,
        opacity: cloud.opacity,
        y: reduced ? 0 : y,
        background: 'radial-gradient(ellipse, rgba(244,233,221,1) 0%, transparent 72%)',
      }}
      initial={{ x: cloud.reverse ? '120%' : '-20%' }}
      animate={
        reduced ? undefined : { x: cloud.reverse ? ['120%', '-20%'] : ['-20%', '120%'] }
      }
      transition={reduced ? undefined : { duration: cloud.duration, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/** Mounted once at the app root: slow drifting glows, cloud haze, scroll
 *  parallax and film grain so every page has quiet aviation-flavored depth
 *  instead of a flat black canvas. Fixed and inert — never intercepts
 *  input, never competes with foreground content. */
export default function AmbientBackground() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()

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
      {CLOUDS.map((cloud, i) => (
        <CloudLayer key={i} cloud={cloud} scrollY={scrollY} reduced={reduced} />
      ))}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN_URL}")`, backgroundSize: '160px 160px' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950/60" />
    </div>
  )
}
