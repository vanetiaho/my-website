import { useEffect, useRef, useState } from 'react'
import './MiniGame.css'

// Simple side-scrolling dodge game
// Triggered by triple-clicking the hero airplane

const GAME_W = 600
const GAME_H = 300
const PLANE_X = 80
const PLANE_W = 50
const PLANE_H = 28
const OBSTACLE_W = 22

function useGameLoop(running, callback) {
  const rafRef = useRef(null)
  const lastRef = useRef(null)

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(rafRef.current)
      lastRef.current = null
      return
    }

    const loop = (ts) => {
      if (lastRef.current === null) lastRef.current = ts
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05) // cap at 50ms
      lastRef.current = ts
      callback(dt)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, callback])
}

const INITIAL_STATE = () => ({
  planeY: GAME_H / 2 - PLANE_H / 2,
  vy: 0,
  obstacles: [],
  score: 0,
  time: 0,
  nextObstacle: 1.2,
  alive: true,
  speed: 220,
})

export default function MiniGame() {
  const [open, setOpen] = useState(false)
  const [gameState, setGameState] = useState(INITIAL_STATE())
  const [best, setBest] = useState(0)
  const canvasRef = useRef(null)
  const stateRef = useRef(gameState)
  const keysRef = useRef(new Set())

  // Listen for the triple-click event from Hero
  useEffect(() => {
    const handler = () => { setOpen(true); resetGame() }
    window.addEventListener('launch-minigame', handler)
    return () => window.removeEventListener('launch-minigame', handler)
  }, [])

  // Keyboard & touch input
  useEffect(() => {
    const onDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        keysRef.current.add('up')
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        keysRef.current.add('down')
      }
    }
    const onUp = (e) => {
      keysRef.current.delete('up')
      keysRef.current.delete('down')
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [])

  const resetGame = () => {
    const s = INITIAL_STATE()
    stateRef.current = s
    setGameState({ ...s })
  }

  // Game loop
  useGameLoop(open && gameState.alive, (dt) => {
    const s = stateRef.current
    if (!s.alive) return

    const up = keysRef.current.has('up')
    const down = keysRef.current.has('down')

    let vy = s.vy
    if (up) vy -= 900 * dt
    else if (down) vy += 600 * dt
    else vy += 400 * dt // gravity

    vy = Math.max(-400, Math.min(400, vy))

    let planeY = s.planeY + vy * dt
    if (planeY < 0) { planeY = 0; vy = 0 }
    if (planeY > GAME_H - PLANE_H) { planeY = GAME_H - PLANE_H; vy = 0 }

    // Move obstacles
    const speed = s.speed + s.score * 0.3
    const obstacles = s.obstacles
      .map(o => ({ ...o, x: o.x - speed * dt }))
      .filter(o => o.x > -OBSTACLE_W)

    // Spawn
    let { nextObstacle } = s
    const time = s.time + dt
    nextObstacle -= dt
    if (nextObstacle <= 0) {
      const gap = 80 + Math.random() * 60
      const gapTop = Math.random() * (GAME_H - gap - 20) + 10
      obstacles.push({
        id: Date.now(),
        x: GAME_W + OBSTACLE_W,
        gapTop,
        gap,
      })
      nextObstacle = Math.max(0.7, 1.4 - s.score * 0.005)
    }

    // Collision
    const planeCX = PLANE_X + PLANE_W * 0.5
    const planeCY = planeY + PLANE_H * 0.5
    let alive = true
    for (const o of obstacles) {
      if (planeCX + PLANE_W * 0.4 > o.x && planeCX - PLANE_W * 0.4 < o.x + OBSTACLE_W) {
        if (planeCY - PLANE_H * 0.4 < o.gapTop || planeCY + PLANE_H * 0.4 > o.gapTop + o.gap) {
          alive = false
          break
        }
      }
    }

    const score = s.score + dt * 10

    const next = { ...s, planeY, vy, obstacles, score, time, nextObstacle, alive, speed }
    stateRef.current = next
    setGameState({ ...next })

    if (!alive) setBest(b => Math.max(b, Math.floor(score)))

    // Draw
    draw(canvasRef.current, next)
  })

  // Draw function
  function draw(canvas, s) {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, GAME_W, GAME_H)

    // BG
    const grad = ctx.createLinearGradient(0, 0, 0, GAME_H)
    grad.addColorStop(0, '#05050f')
    grad.addColorStop(1, '#0d0a18')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, GAME_W, GAME_H)

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 1
    for (let y = 0; y < GAME_H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GAME_W, y); ctx.stroke()
    }

    // Scrolling ground dashes
    const offset = (s.time * s.speed * 0.3) % 60
    ctx.strokeStyle = 'rgba(255,107,53,0.2)'
    ctx.lineWidth = 1
    for (let x = -offset; x < GAME_W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, GAME_H - 8); ctx.lineTo(x + 30, GAME_H - 8); ctx.stroke()
    }

    // Obstacles (cloud-like)
    s.obstacles.forEach(o => {
      // Top cloud
      const topH = o.gapTop
      ctx.fillStyle = 'rgba(255,107,53,0.18)'
      ctx.strokeStyle = 'rgba(255,107,53,0.5)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.rect(o.x, 0, OBSTACLE_W, topH)
      ctx.fill(); ctx.stroke()

      // Bottom cloud
      const botY = o.gapTop + o.gap
      const botH = GAME_H - botY
      ctx.beginPath()
      ctx.rect(o.x, botY, OBSTACLE_W, botH)
      ctx.fill(); ctx.stroke()

      // Gap hint line
      ctx.strokeStyle = 'rgba(139,92,246,0.3)'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(o.x + OBSTACLE_W / 2, o.gapTop)
      ctx.lineTo(o.x + OBSTACLE_W / 2, o.gapTop + o.gap)
      ctx.stroke()
      ctx.setLineDash([])
    })

    // Plane
    const px = PLANE_X, py = s.planeY
    const tilt = Math.max(-15, Math.min(15, s.vy * 0.03))
    ctx.save()
    ctx.translate(px + PLANE_W / 2, py + PLANE_H / 2)
    ctx.rotate((tilt * Math.PI) / 180)
    // Body
    ctx.fillStyle = '#e2e8f0'
    ctx.beginPath()
    ctx.ellipse(0, 0, PLANE_W / 2, PLANE_H / 2 * 0.5, 0, 0, Math.PI * 2)
    ctx.fill()
    // Wing
    ctx.fillStyle = '#94a3b8'
    ctx.beginPath()
    ctx.moveTo(4, 0); ctx.lineTo(18, -14); ctx.lineTo(22, -11); ctx.lineTo(8, 0)
    ctx.closePath(); ctx.fill()
    ctx.beginPath()
    ctx.moveTo(4, 0); ctx.lineTo(18, 14); ctx.lineTo(22, 11); ctx.lineTo(8, 0)
    ctx.closePath(); ctx.fill()
    // Engine glow
    ctx.fillStyle = 'rgba(255,107,53,0.9)'
    ctx.beginPath(); ctx.arc(-PLANE_W / 2 + 4, 0, 4, 0, Math.PI * 2); ctx.fill()
    ctx.restore()

    // Score
    ctx.fillStyle = 'rgba(255,107,53,0.9)'
    ctx.font = '13px "JetBrains Mono", monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`ALT: ${Math.floor(s.score).toString().padStart(5, '0')} km`, 12, 22)

    // Hint
    ctx.fillStyle = 'rgba(148,163,184,0.4)'
    ctx.font = '11px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('↑ / SPACE = climb   ↓ = dive', GAME_W / 2, GAME_H - 14)
  }

  if (!open) return null

  return (
    <div className="minigame-overlay" role="dialog" aria-modal="true" aria-label="Mini game">
      <div className="minigame-modal">
        <div className="minigame-header">
          <span className="mono minigame-title">✈ ALTITUDE DODGE</span>
          <button
            className="minigame-close interactive"
            onClick={() => setOpen(false)}
            aria-label="Close game"
          >
            ✕
          </button>
        </div>

        <div className="minigame-canvas-wrap">
          <canvas
            ref={canvasRef}
            width={GAME_W}
            height={GAME_H}
            className="minigame-canvas"
            aria-label="Altitude dodge game canvas"
          />
          {!gameState.alive && (
            <div className="minigame-gameover">
              <div className="gameover-icon">💥</div>
              <p className="mono gameover-score">Score: {Math.floor(gameState.score)} km</p>
              <p className="mono gameover-best">Best: {best} km</p>
              <button className="btn-primary interactive" onClick={resetGame}>
                Retry ↺
              </button>
            </div>
          )}
        </div>

        {/* Touch controls */}
        <div className="minigame-touch-controls">
          <button
            className="touch-btn interactive"
            onPointerDown={() => keysRef.current.add('up')}
            onPointerUp={() => keysRef.current.delete('up')}
            onPointerLeave={() => keysRef.current.delete('up')}
            aria-label="Climb"
          >
            ↑ Climb
          </button>
          <button
            className="touch-btn interactive"
            onPointerDown={() => keysRef.current.add('down')}
            onPointerUp={() => keysRef.current.delete('down')}
            onPointerLeave={() => keysRef.current.delete('down')}
            aria-label="Dive"
          >
            ↓ Dive
          </button>
        </div>

        <p className="minigame-hint mono">
          Triple-click the hero airplane to unlock this. ESC to close.
        </p>
      </div>
    </div>
  )
}
