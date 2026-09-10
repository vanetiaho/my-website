/** The one plane silhouette used everywhere: navbar mark, cursor, entrance flyover, scroll indicator. */
export const PLANE_PATH = 'M2 12l7-1 3-4 1 .3-2 4.7 6 .5-1 1.3-6 .2-2 3.5-1-.2.7-3z'

export default function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={PLANE_PATH} />
    </svg>
  )
}
