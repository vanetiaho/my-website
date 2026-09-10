import { useEffect, useRef, useState } from 'react'
import './Entrance.css'

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 3,
  duration: Math.random() * 2 + 2,
}))

export default function Entrance({ onEnter }) {
  const [phase, setPhase] = useState('idle') // idle | typing | ready | departing
  const [displayed, setDisplayed] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)
  const planRef = useRef(null)
  const fullText = 'FLIGHT PLAN FILED. RUNWAY CLEAR.'

  useEffect(() => {
    // Start typing effect after 800ms
    const startTimer = setTimeout(() => {
      setPhase('typing')
    }, 800)
    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (phase !== 'typing') return
    let index = 0
    const interval = setInterval(() => {
      setDisplayed(fullText.slice(0, index + 1))
      index++
      if (index >= fullText.length) {
        clearInterval(interval)
        setTimeout(() => {
          setPhase('ready')
          setShowPrompt(true)
        }, 600)
      }
    }, 55)
    return () => clearInterval(interval)
  }, [phase])

  const handleEnter = () => {
    if (phase !== 'ready') return
    setPhase('departing')
    // Animate plane takeoff, then transition
    setTimeout(() => onEnter(), 1200)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleEnter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  return (
    <div
      className={`entrance ${phase === 'departing' ? 'departing' : ''}`}
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      aria-label="Enter portfolio — press Enter or click"
    >
      {/* Stars */}
      <div className="entrance-stars" aria-hidden="true">
        {STARS.map(s => (
          <div
            key={s.id}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Horizon glow */}
      <div className="entrance-horizon" aria-hidden="true" />

      {/* Runway */}
      <div className="entrance-runway" aria-hidden="true">
        <div className="runway-line" />
        <div className="runway-line" />
        <div className="runway-line" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="runway-dash"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Airplane */}
      <div
        ref={planRef}
        className={`entrance-plane ${phase === 'departing' ? 'takeoff' : ''}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" fill="none">
          {/* Body */}
          <ellipse cx="50" cy="30" rx="40" ry="9" fill="#e2e8f0" />
          {/* Nose */}
          <path d="M90 30 Q100 28 98 32 Z" fill="#e2e8f0" />
          {/* Main wing */}
          <path d="M55 30 L75 10 L80 12 L65 30 Z" fill="#94a3b8" />
          <path d="M55 30 L75 50 L80 48 L65 30 Z" fill="#94a3b8" />
          {/* Tail wing */}
          <path d="M18 30 L10 18 L15 20 L22 30 Z" fill="#64748b" />
          <path d="M18 30 L10 42 L15 40 L22 30 Z" fill="#64748b" />
          {/* Engine glow */}
          <circle cx="65" cy="14" r="3" fill="var(--accent-orange)" opacity="0.7" />
          <circle cx="65" cy="46" r="3" fill="var(--accent-orange)" opacity="0.7" />
          {/* Window strip */}
          <rect x="38" y="26" width="30" height="8" rx="4" fill="rgba(139,92,246,0.4)" />
          <circle cx="44" cy="30" r="2.5" fill="rgba(139,92,246,0.8)" />
          <circle cx="52" cy="30" r="2.5" fill="rgba(139,92,246,0.8)" />
          <circle cx="60" cy="30" r="2.5" fill="rgba(139,92,246,0.8)" />
        </svg>
      </div>

      {/* HUD / terminal text */}
      <div className="entrance-hud">
        <div className="hud-label mono">SYS://PORTFOLIO_v1.0</div>
        <div className="hud-text mono">
          {displayed}
          <span className="hud-cursor" style={{ opacity: phase === 'ready' ? 1 : 1 }}>_</span>
        </div>
        {showPrompt && (
          <div className="hud-prompt animate-fadeInUp">
            <span className="hud-key">ENTER</span> or <span className="hud-key">CLICK</span> to board
          </div>
        )}
      </div>

      {/* Corner decorations */}
      <div className="hud-corner tl" aria-hidden="true" />
      <div className="hud-corner tr" aria-hidden="true" />
      <div className="hud-corner bl" aria-hidden="true" />
      <div className="hud-corner br" aria-hidden="true" />
    </div>
  )
}
