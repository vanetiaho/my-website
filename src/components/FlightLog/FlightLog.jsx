import { useEffect, useRef, useState } from 'react'
import './FlightLog.css'

// Generate 52 weeks × 7 days of fake contribution data
function generateContributions() {
  const weeks = []
  for (let w = 0; w < 52; w++) {
    const days = []
    for (let d = 0; d < 7; d++) {
      const rand = Math.random()
      let level
      if (rand < 0.35) level = 0
      else if (rand < 0.55) level = 1
      else if (rand < 0.72) level = 2
      else if (rand < 0.88) level = 3
      else level = 4
      days.push(level)
    }
    weeks.push(days)
  }
  return weeks
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const CONTRIBUTION_DATA = generateContributions()
const TOTAL = CONTRIBUTION_DATA.flat().reduce((sum, l) => sum + l, 0)

export default function FlightLog() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.2 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="flightlog" className="flightlog-section" ref={sectionRef}>
      <div className="section">
        <p className="section-label">// github.activity</p>
        <div className="flightlog-header">
          <h2 className="flightlog-title">
            Flight <span className="gradient-text">Log</span>
          </h2>
          <p className="flightlog-desc">
            Every commit is a kilometer flown. Here's the year in the cockpit.
          </p>
        </div>

        {/* Stats strip */}
        <div className="flightlog-stats">
          {[
            { label: 'Total Altitude (commits)', value: `${TOTAL} km`, icon: '↑' },
            { label: 'Active Flight Days', value: `${CONTRIBUTION_DATA.flat().filter(v => v > 0).length}`, icon: '✈' },
            { label: 'Peak Altitude', value: `${Math.max(...CONTRIBUTION_DATA.flat())} tier`, icon: '⬡' },
            { label: 'Repositories', value: '[N]+', icon: '◈' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flightlog-stat card">
              <span className="stat-icon">{icon}</span>
              <span className="stat-val mono gradient-text">{value}</span>
              <span className="stat-lbl">{label}</span>
            </div>
          ))}
        </div>

        {/* Contribution graph */}
        <div className={`flightlog-graph-wrap ${inView ? 'visible' : ''}`}>
          {/* HUD frame */}
          <div className="graph-hud-label mono">SYS://FLIGHT_LOG — [GITHUB]</div>

          <div className="graph-container">
            {/* Day labels */}
            <div className="graph-days" aria-hidden="true">
              {DAYS.map((d, i) => (
                <span key={i} className="graph-day-label mono">{d}</span>
              ))}
            </div>

            {/* Graph grid */}
            <div className="graph-weeks" role="img" aria-label="GitHub contribution graph">
              {CONTRIBUTION_DATA.map((week, wi) => (
                <div key={wi} className="graph-week">
                  {week.map((level, di) => {
                    const id = `${wi}-${di}`
                    return (
                      <div
                        key={di}
                        className={`graph-cell level-${level} ${inView ? 'animate' : ''}`}
                        style={{ animationDelay: `${(wi * 7 + di) * 4}ms` }}
                        onMouseEnter={() => setHovered({ wi, di, level })}
                        onMouseLeave={() => setHovered(null)}
                        role="gridcell"
                        aria-label={`Week ${wi + 1}, Day ${di + 1}: ${level} contributions`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Month labels */}
          <div className="graph-months" aria-hidden="true">
            {MONTHS.map(m => (
              <span key={m} className="graph-month mono">{m}</span>
            ))}
          </div>

          {/* Legend */}
          <div className="graph-legend" aria-label="Activity level legend">
            <span className="mono legend-label">Less</span>
            {[0, 1, 2, 3, 4].map(l => (
              <div key={l} className={`legend-cell level-${l}`} aria-label={`Level ${l}`} />
            ))}
            <span className="mono legend-label">More</span>
          </div>
        </div>

        {/* GitHub link */}
        <div className="flightlog-cta">
          <a
            href="https://github.com/[GITHUB]"
            className="btn-secondary interactive"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Full Flight Record →
          </a>
        </div>
      </div>
    </section>
  )
}
