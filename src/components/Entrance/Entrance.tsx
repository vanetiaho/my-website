import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'

const AUTO_RESOLVE_MS = 2600

export default function Entrance({ onDone }: { onDone: () => void }) {
  const markEntered = useAppStore((s) => s.markEntered)
  const reduced = useReducedMotion()
  const [leaving, setLeaving] = useState(false)

  const finish = () => {
    if (leaving) return
    setLeaving(true)
    markEntered()
    window.setTimeout(onDone, reduced ? 0 : 500)
  }

  useEffect(() => {
    if (reduced) {
      finish()
      return
    }
    const t = window.setTimeout(finish, AUTO_RESOLVE_MS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', finish, { once: true, passive: true })
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-base-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onClick={finish}
      role="button"
      aria-label="Skip intro"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-sunset-radial opacity-70" />

      <svg
        viewBox="0 0 400 200"
        className="relative w-[80vw] max-w-lg"
        aria-hidden="true"
      >
        {/* Sun */}
        <motion.circle
          cx="200"
          cy="120"
          r="46"
          fill="url(#sunGradient)"
          initial={{ cy: 200, opacity: 0 }}
          animate={{ cy: 100, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="sunGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4b860" />
            <stop offset="100%" stopColor="#c1502e" />
          </linearGradient>
        </defs>

        {/* Horizon line */}
        <motion.line
          x1="0"
          y1="140"
          x2="400"
          y2="140"
          stroke="#e8934a"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: 'easeInOut' }}
        />

        {/* Plane crossing — same mark as the navbar, cursor, and scroll indicator */}
        <motion.g
          initial={{ x: -60, y: 100, opacity: 0 }}
          animate={{ x: 420, y: 70, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.2, delay: 0.6, ease: 'easeIn' }}
        >
          <text x={0} y={20} fontSize={26} fill="#f4e9dd">
            {PLANE_GLYPH}
          </text>
        </motion.g>
      </svg>

      <motion.p
        className="section-label relative mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        capturing the golden hour of life
      </motion.p>
    </motion.div>
  )
}
