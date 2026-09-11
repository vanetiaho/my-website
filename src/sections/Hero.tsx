import { Suspense, lazy, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { profile } from '@/config/site'
import PlaneIcon, { PLANE_GLYPH } from '@/components/icons/PlaneIcon'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const HeroCanvas = lazy(() => import('@/scenes/HeroCanvas'))
const nameLetters = profile.name.split('')

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '22%'])
  const bgOpacity = useTransform(scrollYProgress, [0, 1], reduced ? [0.7, 0.7] : [0.7, 0.25])

  return (
    <section ref={sectionRef} className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <motion.div
        className="absolute inset-0 -z-10 bg-sunset-radial"
        style={{
          y: bgY,
          opacity: bgOpacity,
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
            <span className="mr-1 inline-block align-[-6px] text-2xl">{PLANE_GLYPH}</span>
            welcome aboard
          </p>
          <h1 className="text-6xl font-bold leading-[1.05] sm:text-7xl lg:text-8xl xl:text-9xl">
            <motion.span
              className="interactive relative inline-block cursor-default select-none py-2 font-name font-extrabold"
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
                      hover: reduced
                        ? { color: '#f4b860', transition: { duration: 0.3, delay: i * 0.02 } }
                        : {
                            y: [0, -18, 0],
                            scale: [1, 1.08, 1],
                            color: ['#ffffff', '#f4b860', '#ffffff'],
                            transition: { duration: 0.55, delay: i * 0.032, ease: [0.22, 1, 0.36, 1] },
                          },
                    }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </motion.span>
                ))}
              </motion.span>

              {/* Plane flying across the full name — the wrapper is w-full so the
                  percentage x-transform resolves against the name's actual
                  width, not the icon's own tiny box */}
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 left-0 w-full"
                variants={{
                  rest: { x: '-6%', opacity: 0 },
                  hover: reduced
                    ? { opacity: 1, transition: { duration: 0.3 } }
                    : {
                        x: ['-6%', '100%'],
                        opacity: [0, 1, 1, 1, 0],
                        transition: { duration: 1, ease: [0.65, 0, 0.35, 1] },
                      },
                }}
              >
                <motion.span
                  className="absolute left-0 top-0 inline-block -translate-x-1/2 text-sunset-gold"
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(244,184,96,0.5))' }}
                  variants={{
                    rest: { rotate: 0 },
                    hover: {
                      rotate: [-3, 4, -2, 3, 0],
                      transition: { duration: 1, ease: [0.65, 0, 0.35, 1] },
                    },
                  }}
                >
                  <PlaneIcon className="text-4xl leading-none" />
                </motion.span>
              </motion.span>
            </motion.span>
            <span className="mt-2 block text-2xl font-medium sm:text-3xl">
              <span
                className="text-gradient-sunset"
                style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))' }}
              >
                {profile.role}
              </span>
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
