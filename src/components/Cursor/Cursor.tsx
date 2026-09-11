import { useEffect, useRef } from 'react'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PLANE_GLYPH } from '@/components/icons/PlaneIcon'

export default function Cursor() {
  const isTouch = useIsTouchDevice()
  const reduced = useReducedMotion()
  const planeRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

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
        const scale = hovering ? 1.15 : 1
        planeRef.current.style.transform = `translate3d(${planeX}px, ${planeY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`
        planeRef.current.style.color = hovering ? '#f4b860' : '#e8934a'
      }

      if (trailRef.current) {
        const length = reduced ? 0 : Math.min(speed * 2.2, 70)
        trailRef.current.style.transform = `translate3d(${planeX}px, ${planeY}px, 0) translate(-50%, -50%) rotate(${angle + 180}deg)`
        trailRef.current.style.width = `${length}px`
        trailRef.current.style.opacity = String(Math.min(length / 40, 0.7))
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
      {/* Contrail — stretches behind the plane, fades in with speed */}
      <div
        ref={trailRef}
        className="fixed left-0 top-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-sunset-gold to-transparent"
        style={{ willChange: 'transform, width, opacity', width: 0, opacity: 0 }}
      />
      <div
        ref={planeRef}
        className="fixed left-0 top-0 text-[34px] leading-none transition-[color] duration-150"
        style={{
          willChange: 'transform',
          filter: 'drop-shadow(0 0 6px rgba(244,184,96,0.65))',
        }}
      >
        {PLANE_GLYPH}
      </div>
    </div>
  )
}
