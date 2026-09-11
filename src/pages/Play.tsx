import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'

const PlaneGame = lazy(() => import('@/game/PlaneGame'))

export default function Play() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32 text-center lg:px-8">
      <motion.p
        className="section-label mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="mr-1 inline-block align-[-6px] text-2xl">{PLANE_GLYPH}</span>
        easter.egg
      </motion.p>
      <motion.h1
        className="mb-3 text-3xl font-bold sm:text-4xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        Keep the plane <span className="text-gradient-sunset">flying</span>
      </motion.h1>
      <motion.p
        className="mb-10 text-neutral-400"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
      >
        Tap, click, or press space to flap. Dodge the towers. No pressure — it's just for fun.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.24 }}
      >
        <Suspense
          fallback={
            <div className="mx-auto flex h-[450px] max-w-3xl items-center justify-center rounded-2xl border border-white/10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-sunset-amber/30 border-t-sunset-amber" />
            </div>
          }
        >
          <PlaneGame />
        </Suspense>
      </motion.div>
    </div>
  )
}
