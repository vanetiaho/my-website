import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { profile } from '@/config/site'
import PlaneIcon, { PLANE_GLYPH } from '@/components/icons/PlaneIcon'

const HeroCanvas = lazy(() => import('@/scenes/HeroCanvas'))
const nameLetters = profile.name.split('')

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <div
        className="absolute inset-0 -z-10 bg-sunset-radial opacity-70"
        style={{
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label mb-4">
            <span className="mr-1 inline-block align-[-3px] text-base">{PLANE_GLYPH}</span>
            welcome aboard
          </p>
          <h1 className="text-6xl font-bold leading-[1.05] sm:text-7xl lg:text-8xl">
            <motion.span
              className="interactive relative inline-block cursor-default select-none py-2"
              whileHover="hover"
              initial="rest"
            >
              <motion.span
                className="relative inline-flex"
                variants={{
                  rest: { filter: 'drop-shadow(0 0 0px rgba(244,184,96,0))' },
                  hover: { filter: 'drop-shadow(0 0 18px rgba(244,184,96,0.55))' },
                }}
                transition={{ duration: 0.4 }}
              >
                {nameLetters.map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    variants={{
                      rest: { y: 0, color: '#ffffff' },
                      hover: {
                        y: [0, -26, 0],
                        scale: [1, 1.12, 1],
                        color: ['#ffffff', '#f4b860', '#ffffff'],
                        transition: { duration: 0.6, delay: i * 0.035, ease: 'easeInOut' },
                      },
                    }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </motion.span>
                ))}
              </motion.span>

              {/* Contrail the plane draws as it crosses */}
              <motion.span
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-sunset-gold via-sunset-amber to-sunset-burnt"
                variants={{
                  rest: { scaleX: 0, opacity: 0 },
                  hover: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: 'easeOut', delay: 0.05 } },
                }}
              />

              {/* Plane flying across the name */}
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 left-0 text-sunset-gold"
                variants={{
                  rest: { x: '-10%', opacity: 0 },
                  hover: {
                    x: ['-10%', '108%'],
                    opacity: [0, 1, 1, 0],
                    rotate: [-4, 8, -4],
                    transition: { duration: 0.85, ease: 'easeInOut' },
                  },
                }}
              >
                <PlaneIcon className="text-2xl leading-none" />
              </motion.span>
            </motion.span>
            <span className="mt-2 block text-2xl font-medium text-neutral-400 sm:text-3xl">
              <span className="text-gradient-sunset">{profile.role}</span>
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base text-neutral-400 sm:text-lg">
            {profile.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/projects"
              className="interactive rounded-full bg-gradient-to-r from-sunset-gold to-sunset-amber px-6 py-3 font-mono text-sm font-medium text-base-950 shadow-glow-sm transition-transform hover:scale-105"
            >
              View Projects
            </Link>
            <Link
              to="/contact"
              className="interactive rounded-full border border-white/15 px-6 py-3 font-mono text-sm text-neutral-200 transition-colors hover:border-sunset-amber/60 hover:text-sunset-gold"
            >
              Get in touch
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <Suspense
            fallback={
              <div className="h-full w-full animate-pulse-glow rounded-full bg-sunset-radial opacity-40" />
            }
          >
            <HeroCanvas />
          </Suspense>
        </motion.div>
      </div>
    </section>
  )
}
