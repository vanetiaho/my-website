import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function FlightProgress() {
  const planeRef = useRef<SVGGElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !planeRef.current || !trackRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      scrub: 0.4,
      onUpdate: (self) => {
        const trackHeight = trackRef.current!.clientHeight
        const y = self.progress * (trackHeight - 18)
        const wobble = Math.sin(self.progress * Math.PI * 6) * 6
        gsap.set(planeRef.current, { y, x: wobble, rotate: 90 + wobble })
      },
    })

    // Re-measure after route content mounts
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 200)

    return () => {
      trigger.kill()
      window.clearTimeout(t)
    }
  }, [location.pathname, reduced])

  if (reduced) return null

  return (
    <div
      ref={trackRef}
      className="pointer-events-none fixed right-3 top-24 z-[70] hidden h-[45vh] w-6 lg:block"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-sunset-amber/30 to-transparent" />
      <svg width="24" height="24" viewBox="0 0 24 24" className="absolute left-0 top-0">
        <g ref={planeRef} fill="#f4b860">
          <path d="M2 12l7-1 3-4 1 .3-2 4.7 6 .5-1 1.3-6 .2-2 3.5-1-.2.7-3z" />
        </g>
      </svg>
    </div>
  )
}
