import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const TITLES = [
  'Full-Stack Developer',
  'Open Source Contributor',
  'Cloud Architect',
  'Problem Solver',
]

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayedTitle, setDisplayedTitle] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [planeOffset, setPlaneOffset] = useState({ x: 0, y: 0 })
  const [clickCount, setClickCount] = useState(0)
  const heroRef = useRef(null)
  const clickTimer = useRef(null)

  // Typewriter effect
  useEffect(() => {
    const current = TITLES[titleIndex]
    let timeout

    if (!isDeleting) {
      if (displayedTitle.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayedTitle(current.slice(0, displayedTitle.length + 1))
        }, 80)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2200)
      }
    } else {
      if (displayedTitle.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedTitle(displayedTitle.slice(0, -1))
        }, 40)
      } else {
        setIsDeleting(false)
        setTitleIndex(i => (i + 1) % TITLES.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayedTitle, isDeleting, titleIndex])

  // Parallax on mouse move
  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const x = (e.clientX - cx) / rect.width
      const y = (e.clientY - cy) / rect.height
      setPlaneOffset({ x: x * 25, y: y * 15 })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Easter egg: triple-click the plane
  const handlePlaneClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    clearTimeout(clickTimer.current)
    if (newCount >= 3) {
      setClickCount(0)
      // Dispatch event for MiniGame to catch
      window.dispatchEvent(new CustomEvent('launch-minigame'))
    } else {
      clickTimer.current = setTimeout(() => setClickCount(0), 800)
    }
  }

  return (
    <section id="home" className="hero" ref={heroRef}>
      {/* Background layers */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-gradient" />
        <div className="hero-grid" />
        <div className="hero-horizon" />
      </div>

      {/* Floating airplane with parallax */}
      <div
        className="hero-plane interactive"
        style={{
          transform: `translate(${planeOffset.x}px, ${planeOffset.y}px) rotate(-5deg)`,
        }}
        onClick={handlePlaneClick}
        title={clickCount > 0 ? `${3 - clickCount} more click${3 - clickCount !== 1 ? 's' : ''}...` : 'Psst...'}
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" fill="none">
          {/* Fuselage */}
          <ellipse cx="100" cy="60" rx="78" ry="16" fill="#e2e8f0" />
          {/* Nose cone */}
          <path d="M178 60 Q200 56 198 64 Z" fill="#cbd5e1" />
          {/* Cockpit dome */}
          <path d="M155 60 Q162 44 170 46 Q175 52 172 60 Z" fill="rgba(139,92,246,0.7)" />
          {/* Main wings */}
          <path d="M108 60 L148 18 L158 22 L128 60 Z" fill="#94a3b8" />
          <path d="M108 60 L148 102 L158 98 L128 60 Z" fill="#94a3b8" />
          {/* Wing accent */}
          <path d="M112 60 L145 26 L150 28 L132 60 Z" fill="rgba(255,107,53,0.3)" />
          <path d="M112 60 L145 94 L150 92 L132 60 Z" fill="rgba(255,107,53,0.3)" />
          {/* Tail fins */}
          <path d="M35 60 L22 36 L30 40 L44 60 Z" fill="#64748b" />
          <path d="M35 60 L22 84 L30 80 L44 60 Z" fill="#64748b" />
          {/* Vertical stabilizer */}
          <path d="M28 60 L20 40 L35 46 Z" fill="#475569" />
          {/* Engines */}
          <rect x="120" y="22" width="22" height="10" rx="5" fill="#475569" />
          <rect x="120" y="88" width="22" height="10" rx="5" fill="#475569" />
          {/* Engine glow */}
          <circle cx="120" cy="27" r="4" fill="var(--accent-orange)" opacity="0.8" />
          <circle cx="120" cy="93" r="4" fill="var(--accent-orange)" opacity="0.8" />
          {/* Window strip */}
          <rect x="72" y="54" width="72" height="12" rx="6" fill="rgba(139,92,246,0.25)" />
          <circle cx="82" cy="60" r="4" fill="rgba(139,92,246,0.7)" />
          <circle cx="96" cy="60" r="4" fill="rgba(139,92,246,0.7)" />
          <circle cx="110" cy="60" r="4" fill="rgba(255,107,53,0.7)" />
          <circle cx="124" cy="60" r="4" fill="rgba(139,92,246,0.7)" />
          {/* Contrail */}
          <line x1="22" y1="60" x2="-20" y2="60" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 6" />
        </svg>
        {/* Engine glow fx */}
        <div className="plane-glow" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <p className="section-label animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          ✈ CLEARED FOR LANDING
        </p>
        <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          Hey, I'm <span className="gradient-text">[YOUR NAME]</span>
        </h1>
        <div className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <span className="hero-typewriter mono">
            {displayedTitle}
            <span className="typewriter-cursor">|</span>
          </span>
        </div>
        <p className="hero-desc animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          Building digital products that matter — from backend systems to pixel-perfect UIs.
          Based in <span className="gradient-text">[YOUR CITY]</span>, flying anywhere.
        </p>
        <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <a href="#projects" className="btn-primary interactive" onClick={e => {
            e.preventDefault()
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            View Projects
          </a>
          <a href="#contact" className="btn-secondary interactive" onClick={e => {
            e.preventDefault()
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll" aria-label="Scroll down">
        <span className="scroll-label mono">scroll</span>
        <div className="scroll-arrow" aria-hidden="true" />
      </div>
    </section>
  )
}
