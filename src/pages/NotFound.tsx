import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function NotFound() {
  const reduced = useReducedMotion()

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <motion.p
        className="section-label mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="mr-1 inline-block align-[-6px] text-2xl">{PLANE_GLYPH}</span>
        error.404
      </motion.p>
      <motion.h1
        className="mb-4 text-4xl font-bold"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        Off <span className="text-gradient-sunset">course</span>
      </motion.h1>
      <motion.p
        className="mb-8 max-w-sm text-neutral-400"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
      >
        This page drifted outside controlled airspace. Let's get you back on the flight path.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24 }}
      >
        <Link
          to="/"
          className="interactive rounded-full bg-gradient-to-r from-sunset-gold to-sunset-amber px-6 py-3 font-mono text-sm font-medium text-base-950 transition-transform hover:scale-105"
        >
          Return home
        </Link>
      </motion.div>
      <motion.span
        aria-hidden="true"
        className="mt-10 inline-block text-5xl text-sunset-gold/70"
        initial={{ opacity: 0, x: -40, rotate: -8 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      >
        <motion.span
          className="inline-block"
          animate={reduced ? undefined : { y: [0, -8, 0] }}
          transition={reduced ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {PLANE_GLYPH}
        </motion.span>
      </motion.span>
    </div>
  )
}
