import { useEffect, useRef } from 'react'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Cursor() {
  const isTouch = useIsTouchDevice()
  const reduced = useReducedMotion()
  const planeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isTouch) return

    document.documentElement.classList.add('custom-cursor-active')

    let planeX = window.innerWidth / 2
    let planeY = window.innerHeight / 2
    let mouseX = planeX
    let mouseY = planeY
    let angle = 0
    let hovering = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      const target = e.target as HTMLElement
      hovering = !!target.closest('a, button, [role="button"], input, textarea, .interactive')
    }

    const tick = () => {
      const ease = reduced ? 1 : 0.22
      const dx = mouseX - planeX
      const dy = mouseY - planeY
      planeX += dx * ease
      planeY += dy * ease

      const speed = Math.hypot(dx, dy)
      if (speed > 0.6) {
        const target = (Math.atan2(dy, dx) * 180) / Math.PI
        let delta = target - angle
        delta = ((delta + 180) % 360) - 180
        angle += delta * 0.25
      }

      if (planeRef.current) {
        const scale = hovering ? 1.5 : 1
        planeRef.current.style.transform = `translate3d(${planeX}px, ${planeY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`
        planeRef.current.style.color = hovering ? '#f4b860' : '#e8934a'
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [isTouch, reduced])

  if (isTouch) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] hidden md:block" aria-hidden="true">
      <div
        ref={planeRef}
        className="fixed left-0 top-0 transition-[color] duration-150"
        style={{ willChange: 'transform' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 12l7-1 3-4 1 .3-2 4.7 6 .5-1 1.3-6 .2-2 3.5-1-.2.7-3z" />
        </svg>
      </div>
    </div>
  )
}
