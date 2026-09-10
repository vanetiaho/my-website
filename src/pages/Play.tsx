import { Suspense, lazy } from 'react'

const PlaneGame = lazy(() => import('@/game/PlaneGame'))

export default function Play() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32 text-center lg:px-8">
      <p className="section-label mb-3">// easter.egg</p>
      <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
        Keep the plane <span className="text-gradient-sunset">flying</span>
      </h1>
      <p className="mb-10 text-neutral-400">
        Tap, click, or press space to flap. Dodge the towers. No pressure — it's just for fun.
      </p>

      <Suspense
        fallback={
          <div className="mx-auto flex h-[450px] max-w-3xl items-center justify-center rounded-2xl border border-white/10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sunset-amber/30 border-t-sunset-amber" />
          </div>
        }
      >
        <PlaneGame />
      </Suspense>
    </div>
  )
}
