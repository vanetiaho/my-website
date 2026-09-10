import { Link } from 'react-router-dom'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="section-label mb-3">{PLANE_GLYPH} error.404</p>
      <h1 className="mb-4 text-4xl font-bold">
        Off <span className="text-gradient-sunset">course</span>
      </h1>
      <p className="mb-8 max-w-sm text-neutral-400">
        This page drifted outside controlled airspace. Let's get you back on the flight path.
      </p>
      <Link
        to="/"
        className="interactive rounded-full bg-gradient-to-r from-sunset-gold to-sunset-amber px-6 py-3 font-mono text-sm font-medium text-base-950"
      >
        Return home
      </Link>
    </div>
  )
}
