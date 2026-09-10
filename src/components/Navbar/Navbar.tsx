import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import PlaneIcon from '@/components/icons/PlaneIcon'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/music', label: 'Music' },
  { to: '/play', label: 'Play' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed left-1/2 top-4 z-[80] -translate-x-1/2">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`glass-panel flex items-center gap-1 rounded-full px-2 py-2 shadow-glow-sm transition-all duration-300 ${
          scrolled ? 'scale-95 gap-0.5 px-1.5 py-1.5' : ''
        }`}
        aria-label="Primary"
      >
        <NavLink
          to="/"
          className="interactive mr-1 hidden select-none items-center px-3 text-lg leading-none text-sunset-gold sm:flex"
          aria-label="Home"
        >
          <PlaneIcon />
        </NavLink>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `interactive relative rounded-full px-3.5 py-2 font-mono text-xs uppercase tracking-wide transition-colors sm:text-sm ${
                isActive ? 'text-base-950' : 'text-neutral-300 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-sunset-gold to-sunset-amber"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </motion.nav>
    </header>
  )
}
