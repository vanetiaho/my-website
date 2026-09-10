import { useEffect, useRef, useState } from 'react'
import './Music.css'

const TRACKS = [
  { title: '[Favourite Track]', artist: '[Artist Name]', duration: '3:42' },
  { title: '[Late Night Coding Anthem]', artist: '[Artist Name]', duration: '4:15' },
  { title: '[The Flow State Song]', artist: '[Artist Name]', duration: '5:08' },
  { title: '[Sunrise Runway]', artist: '[Artist Name]', duration: '3:55' },
  { title: '[Altitude Mix]', artist: '[Artist Name]', duration: '6:22' },
]

export default function Music() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [playing, setPlaying] = useState(false) // No autoplay
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [angle, setAngle] = useState(0)
  const rafRef = useRef(null)
  const lastTimestamp = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.2 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  // Spin animation for the vinyl
  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current)
      lastTimestamp.current = null
      return
    }

    const animate = (ts) => {
      if (lastTimestamp.current === null) lastTimestamp.current = ts
      const delta = ts - lastTimestamp.current
      lastTimestamp.current = ts
      setAngle(a => a + (delta * 0.06)) // ~21.6 deg/sec
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  return (
    <section id="music" className="music-section" ref={sectionRef}>
      <div className="section">
        <div className={`music-grid ${inView ? 'visible' : ''}`}>
          {/* Vinyl + player */}
          <div className="music-player">
            <p className="section-label">// music.taste</p>
            <h2 className="music-title">
              Sounds from the <span className="gradient-text">cockpit</span>
            </h2>
            <p className="music-desc">
              Music is the other language I speak fluently. Here's what's in rotation
              while I build things at altitude.
            </p>

            {/* Vinyl record */}
            <div className="vinyl-container">
              <div
                className={`vinyl-arm ${playing ? 'playing' : ''}`}
                aria-hidden="true"
              />
              <div
                className="vinyl-record interactive"
                style={{ transform: `rotate(${angle}deg)` }}
                onClick={() => setPlaying(p => !p)}
                role="button"
                tabIndex={0}
                aria-label={playing ? 'Pause vinyl' : 'Play vinyl'}
                onKeyDown={e => e.key === 'Enter' && setPlaying(p => !p)}
              >
                {/* Outer ring */}
                <div className="vinyl-grooves" aria-hidden="true">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="vinyl-groove" style={{
                      width: `${95 - i * 5}%`,
                      height: `${95 - i * 5}%`,
                    }} />
                  ))}
                </div>
                {/* Label */}
                <div className="vinyl-label" aria-hidden="true">
                  <div className="vinyl-label-text mono">✈</div>
                  <div className="vinyl-label-name mono">ALTITUDE</div>
                  <div className="vinyl-spindle" />
                </div>
              </div>

              {/* Play/pause overlay */}
              <div className="vinyl-play-hint" aria-hidden="true">
                {playing ? '⏸' : '▶'}
              </div>
            </div>

            {/* Now playing */}
            <div className="now-playing">
              <span className="now-playing-label mono">
                {playing ? '▶ NOW PLAYING' : '⏸ PAUSED'}
              </span>
              <p className="now-playing-title">{TRACKS[selectedTrack].title}</p>
              <p className="now-playing-artist">{TRACKS[selectedTrack].artist}</p>
            </div>
          </div>

          {/* Track list */}
          <div className="music-tracks">
            <p className="section-label">// playlist</p>
            <div className="track-list" role="list">
              {TRACKS.map((track, i) => (
                <div
                  key={i}
                  className={`track-item interactive ${selectedTrack === i ? 'active' : ''}`}
                  onClick={() => { setSelectedTrack(i); setPlaying(true) }}
                  role="listitem button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && (setSelectedTrack(i), setPlaying(true))}
                  aria-label={`Play ${track.title} by ${track.artist}`}
                >
                  <span className="track-num mono">
                    {selectedTrack === i && playing ? '♪' : String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="track-info">
                    <span className="track-title">{track.title}</span>
                    <span className="track-artist">{track.artist}</span>
                  </div>
                  <span className="track-dur mono">{track.duration}</span>
                </div>
              ))}
            </div>

            {/* Spotify link */}
            <a
              href="https://open.spotify.com/user/[SPOTIFY]"
              className="spotify-btn interactive"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View full playlist on Spotify"
            >
              <SpotifyIcon />
              Open on Spotify
            </a>

            <p className="music-note">
              No music plays automatically — click the vinyl or a track to listen.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SpotifyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}
