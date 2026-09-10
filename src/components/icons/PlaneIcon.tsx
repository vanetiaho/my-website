/** The one plane mark used everywhere: navbar, cursor, entrance flyover, scroll indicator, section labels. */
export const PLANE_GLYPH = '✈︎'

export default function PlaneIcon({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      {PLANE_GLYPH}
    </span>
  )
}
