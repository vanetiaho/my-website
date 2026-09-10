import { useEffect, useRef, useState } from 'react'
import { skillTags, skillCategories } from '../../data/skills'
import './About.css'

function useInView(ref, threshold = 0.2) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

export default function About() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef)

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="section">
        <div className={`about-grid ${inView ? 'visible' : ''}`}>
          {/* Bio column */}
          <div className="about-bio">
            <p className="section-label">// about.me</p>
            <h2 className="about-heading">
              Building with <span className="gradient-text">purpose</span>,<br />
              shipping with <span className="gradient-text">craft</span>.
            </h2>
            <div className="about-text">
              <p>
                I'm <strong>[YOUR NAME]</strong> — a full-stack developer based in{' '}
                <strong>[YOUR CITY]</strong>. I love turning complex problems into elegant,
                maintainable software. From system design to UI polish, I care deeply about
                the whole stack.
              </p>
              <p>
                Outside of code, you'll find me tracking flight paths, hunting for vinyl
                records, or contributing to open-source projects. I believe the best software
                feels inevitable — like it couldn't have been built any other way.
              </p>
              <p>
                Currently <span className="status-badge">
                  <span className="status-dot" />
                  Open to opportunities
                </span>
              </p>
            </div>

            {/* Quick stats */}
            <div className="about-stats">
              {[
                { label: 'Years coding', value: '[N]+' },
                { label: 'Projects shipped', value: '[N]+' },
                { label: 'Cups of coffee', value: '∞' },
              ].map(({ label, value }) => (
                <div key={label} className="stat-item">
                  <span className="stat-value mono gradient-text">{value}</span>
                  <span className="stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills column */}
          <div className="about-skills">
            {/* Skill tag cloud */}
            <div className="skills-cloud">
              <p className="section-label">// skills.stack</p>
              <div className="skills-tags" role="list">
                {skillTags.map((skill, i) => (
                  <span
                    key={skill}
                    className="tag interactive"
                    role="listitem"
                    style={{ animationDelay: `${i * 0.03}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill bars */}
            <div className="skills-bars">
              <p className="section-label">// proficiency</p>
              {skillCategories[0].skills.map(({ name, level }) => (
                <div key={name} className="skill-bar-row">
                  <div className="skill-bar-label">
                    <span className="mono">{name}</span>
                    <span className="mono skill-pct">{level}%</span>
                  </div>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      style={{
                        '--target-width': `${level}%`,
                        animationPlayState: inView ? 'running' : 'paused',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
