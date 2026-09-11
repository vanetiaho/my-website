import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import PlaneIcon from '@/components/icons/PlaneIcon'

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
  { top: '8%', width: '55vw', height: '14vw', opacity: 0.08, duration: 75, parallax: 40 },
  { top: '38%', width: '70vw', height: '10vw', opacity: 0.06, duration: 105, parallax: 90, reverse: true },
  { top: '68%', width: '46vw', height: '16vw', opacity: 0.07, duration: 90, parallax: 60 },
]

const BLOBS: Blob[] = [
  {
    className: 'left-[-10%] top-[-10%]',
    color: 'rgba(74,37,69,0.65)',
    size: '54vw',
    from: { x: '0%', y: '0%' },
    to: { x: '14%', y: '16%' },
    duration: 30,
  },
  {
    className: 'right-[-15%] top-[15%]',
    color: 'rgba(193,80,46,0.45)',
    size: '58vw',
    from: { x: '0%', y: '0%' },
    to: { x: '-16%', y: '18%' },
    duration: 36,
  },
  {
    className: 'left-[10%] bottom-[-20%]',
    color: 'rgba(25,27,58,0.7)',
    size: '56vw',
    from: { x: '0%', y: '0%' },
    to: { x: '12%', y: '-14%' },
    duration: 33,
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
function BackgroundFlybyPlane({
  reduced,
  index,
}: {
  reduced: boolean
  index: number
}) {
  const flights = [
    {
      from: { x: '-12vw', y: '18vh' },
      to: { x: '112vw', y: '32vh' },
      rotate: 10,
      duration: 13,
      delay: 2,
      size: 'text-xl sm:text-2xl',
    },
    {
      from: { x: '108vw', y: '58vh' },
      to: { x: '-12vw', y: '42vh' },
      rotate: 190,
      duration: 17,
      delay: 7,
      size: 'text-lg sm:text-xl',
    },
    {
      from: { x: '25vw', y: '110vh' },
      to: { x: '78vw', y: '-12vh' },
      rotate: -55,
      duration: 15,
      delay: 11,
      size: 'text-xl sm:text-2xl',
    },
  ]

  const flight = flights[index]

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-10 text-sunset-gold/20 ${flight.size}`}
      initial={{
        x: flight.from.x,
        y: flight.from.y,
        opacity: 0,
        rotate: flight.rotate,
      }}
      animate={
        reduced
          ? { opacity: 0 }
          : {
              x: flight.to.x,
              y: flight.to.y,
              opacity: [0, 0.7, 0.7, 0],
            }
      }
      transition={
        reduced
          ? undefined
          : {
              duration: flight.duration,
              delay: flight.delay,
              repeat: Infinity,
              repeatDelay: 4 + index * 2,
              ease: 'linear',
            }
      }
    >
      <PlaneIcon className="leading-none" />
    </motion.div>
  )
}

export default function AmbientBackground() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-base-950" />

      {BLOBS.map((blob) => (
        <motion.div
          key={blob.className}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
          }}
          animate={
            reduced
              ? undefined
              : {
                  x: [blob.from.x, blob.to.x],
                  y: [blob.from.y, blob.to.y],
                }
          }
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}

      {CLOUDS.map((cloud) => (
        <CloudLayer
          key={cloud.top}
          cloud={cloud}
          scrollY={scrollY}
          reduced={reduced}
        />
      ))}

      {/* Subtle background aircraft flyby */}
      {[0, 1, 2].map((index) => ( <BackgroundFlybyPlane key={index} reduced={reduced} index={index} /> ))}

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("${GRAIN_URL}")`,
          backgroundSize: '160px 160px',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950/60" />
    </div>
  )
}
