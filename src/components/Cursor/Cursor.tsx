import { useEffect, useRef } from 'react'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Cursor() {
  const isTouch = useIsTouchDevice()
  const reduced = useReducedMotion()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isTouch) return

    document.documentElement.classList.add('custom-cursor-active')

    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2
    let mouseX = ringX
    let mouseY = ringY
    let hovering = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      }
      const target = e.target as HTMLElement
      hovering = !!target.closest('a, button, [role="button"], input, textarea, .interactive')
    }

    const tick = () => {
      const ease = reduced ? 1 : 0.18
      ringX += (mouseX - ringX) * ease
      ringY += (mouseY - ringY) * ease
      if (ringRef.current) {
        const scale = hovering ? 1.8 : 1
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`
        ringRef.current.style.borderColor = hovering ? '#f4b860' : 'rgba(232,147,74,0.6)'
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
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-sunset-gold"
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 rounded-full border transition-[border-color] duration-200"
        style={{ transitionProperty: 'border-color' }}
      />
    </div>
  )
}
