import { useEffect, useRef, useState } from 'react'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'GitHub', href: '#flightlog' },
  { label: 'Music', href: '#music' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.slice(1))
    const observers = []

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  const handleLink = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav
      ref={navRef}
      className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}
      aria-label="Main navigation"
    >
      <div className="navbar-pill">
        {/* Logo mark */}
        <a
          href="#home"
          className="navbar-logo"
          onClick={e => handleLink(e, '#home')}
          aria-label="Home"
        >
          <span className="navbar-logo-icon" aria-hidden="true">✈</span>
          <span className="navbar-logo-text mono">[DEV]</span>
        </a>

        {/* Desktop links */}
        <ul className="navbar-links" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.slice(1)
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`navbar-link ${active === id ? 'active' : ''}`}
                  onClick={e => handleLink(e, href)}
                  aria-current={active === id ? 'page' : undefined}
                >
                  {label}
                  {active === id && <span className="navbar-link-dot" aria-hidden="true" />}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(p => !p)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="navbar-mobile-menu" role="menu">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`mobile-link ${active === href.slice(1) ? 'active' : ''}`}
              onClick={e => handleLink(e, href)}
              role="menuitem"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
