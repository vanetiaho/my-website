import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Vinyl({
  spinning,
  onToggle,
  loading,
}: {
  spinning: boolean
  onToggle: () => void
  /** Player is still connecting — shown briefly instead of play/pause. */
  loading?: boolean
}) {
  const reduced = useReducedMotion()

  return (
    <button
      onClick={onToggle}
      className="interactive group relative mx-auto block aspect-square w-full max-w-xs"
      aria-label={spinning ? 'Pause' : 'Play'}
    >
      <motion.div
        className="h-full w-full rounded-full bg-[radial-gradient(circle,#1a1522_0%,#1a1522_18%,#100d14_19%,#100d14_30%,#1a1522_31%,#1a1522_40%,#100d14_41%,#100d14_55%,#1a1522_56%,#1a1522_100%)] shadow-2xl"
        animate={spinning && !reduced ? { rotate: 360 } : { rotate: 0 }}
        transition={
          spinning && !reduced
            ? { repeat: Infinity, ease: 'linear', duration: 3 }
            : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <div className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sunset-gradient shadow-glow">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full text-center">
            <span className="font-display text-lg font-bold text-base-950">✈</span>
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-base-950" />
      </motion.div>

      {/* Subtle glow that blooms while actually playing */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-sunset-radial blur-2xl"
        animate={{ opacity: spinning ? 0.35 : 0 }}
        transition={{ duration: 0.6 }}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        <span className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 font-mono text-xs text-white backdrop-blur-sm">
          {loading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              connecting
            </>
          ) : spinning ? (
            '❙❙ pause'
          ) : (
            '▶ play'
          )}
        </span>
      </div>
    </button>
  )
}
