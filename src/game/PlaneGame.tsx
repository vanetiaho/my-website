import { useEffect, useRef, useState } from 'react'

const WIDTH = 800
const HEIGHT = 450
const GRAVITY = 0.45
const FLAP_VELOCITY = -7.6
const OBSTACLE_SPEED = 3.2
const OBSTACLE_GAP = 150
const OBSTACLE_WIDTH = 64
const OBSTACLE_INTERVAL = 1500
const HIGH_SCORE_KEY = 'sunset-portfolio:plane-highscore'

type Obstacle = { x: number; gapY: number; passed: boolean }
type GameState = 'ready' | 'playing' | 'gameover'

export default function PlaneGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<GameState>('ready')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === 'undefined') return 0
    return Number(window.localStorage.getItem(HIGH_SCORE_KEY) || 0)
  })

  const plane = useRef({ y: HEIGHT / 2, vy: 0 })
  const obstacles = useRef<Obstacle[]>([])
  const lastSpawn = useRef(0)
  const rafId = useRef(0)
  const stateRef = useRef<GameState>('ready')
  const scoreRef = useRef(0)

  const flap = () => {
    if (stateRef.current === 'ready') {
      startGame()
      return
    }
    if (stateRef.current === 'gameover') {
      startGame()
      return
    }
    plane.current.vy = FLAP_VELOCITY
  }

  const startGame = () => {
    plane.current = { y: HEIGHT / 2, vy: 0 }
    obstacles.current = []
    lastSpawn.current = performance.now()
    scoreRef.current = 0
    setScore(0)
    stateRef.current = 'playing'
    setState('playing')
  }

  const endGame = () => {
    stateRef.current = 'gameover'
    setState('gameover')
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current)
      window.localStorage.setItem(HIGH_SCORE_KEY, String(scoreRef.current))
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = (time: number) => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT)
      grad.addColorStop(0, '#191b3a')
      grad.addColorStop(0.45, '#4a2545')
      grad.addColorStop(0.75, '#c1502e')
      grad.addColorStop(1, '#f4b860')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      ctx.beginPath()
      ctx.arc(WIDTH - 140, HEIGHT - 60, 46, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(244,232,220,0.85)'
      ctx.fill()

      if (stateRef.current === 'playing') {
        plane.current.vy += GRAVITY
        plane.current.y += plane.current.vy

        if (time - lastSpawn.current > OBSTACLE_INTERVAL) {
          lastSpawn.current = time
          const margin = 70
          const gapY = margin + Math.random() * (HEIGHT - margin * 2 - OBSTACLE_GAP)
          obstacles.current.push({ x: WIDTH + OBSTACLE_WIDTH, gapY, passed: false })
        }

        obstacles.current.forEach((o) => (o.x -= OBSTACLE_SPEED))
        obstacles.current = obstacles.current.filter((o) => o.x > -OBSTACLE_WIDTH)

        const planeX = 130
        const planeRadius = 16

        obstacles.current.forEach((o) => {
          if (!o.passed && o.x + OBSTACLE_WIDTH < planeX) {
            o.passed = true
            scoreRef.current += 1
            setScore(scoreRef.current)
          }
          const withinX = planeX + planeRadius > o.x && planeX - planeRadius < o.x + OBSTACLE_WIDTH
          const withinGap =
            plane.current.y - planeRadius > o.gapY &&
            plane.current.y + planeRadius < o.gapY + OBSTACLE_GAP
          if (withinX && !withinGap) endGame()
        })

        if (plane.current.y + planeRadius > HEIGHT || plane.current.y - planeRadius < 0) {
          endGame()
        }
      }

      // Obstacles (silhouette clouds/pillars)
      ctx.fillStyle = 'rgba(10,8,14,0.75)'
      obstacles.current.forEach((o) => {
        ctx.fillRect(o.x, 0, OBSTACLE_WIDTH, o.gapY)
        ctx.fillRect(o.x, o.gapY + OBSTACLE_GAP, OBSTACLE_WIDTH, HEIGHT - (o.gapY + OBSTACLE_GAP))
      })

      // Plane
      const planeX = 130
      ctx.save()
      ctx.translate(planeX, plane.current.y)
      const angle = Math.max(-0.5, Math.min(0.9, plane.current.vy * 0.06))
      ctx.rotate(angle)

      // Fuselage
      ctx.fillStyle = '#f4ead9'
      ctx.beginPath()
      ctx.moveTo(24, 0)
      ctx.lineTo(-8, -8)
      ctx.lineTo(-2, 0)
      ctx.lineTo(-8, 8)
      ctx.closePath()
      ctx.fill()

      // Upper wing fold
      ctx.fillStyle = '#f4b860'
      ctx.beginPath()
      ctx.moveTo(11, -1.5)
      ctx.lineTo(-7, -13)
      ctx.lineTo(0, -1.5)
      ctx.closePath()
      ctx.fill()

      // Tail fin
      ctx.fillStyle = '#c1502e'
      ctx.beginPath()
      ctx.moveTo(-2, 0)
      ctx.lineTo(-11, -6.5)
      ctx.lineTo(-9, 0)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Score
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.font = '600 24px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(String(scoreRef.current), WIDTH / 2, 48)

      rafId.current = requestAnimationFrame(draw)
    }

    rafId.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId.current)
  }, [highScore])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault()
        flap()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-3xl select-none">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onMouseDown={flap}
        onTouchStart={(e) => {
          e.preventDefault()
          flap()
        }}
        className="interactive w-full cursor-pointer rounded-2xl border border-white/10 shadow-glow-sm"
      />

      {state !== 'playing' && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/40 text-center">
          <p className="font-display text-2xl font-bold text-white">
            {state === 'ready' ? 'Keep the plane flying' : 'You crashed'}
          </p>
          <p className="font-mono text-sm text-neutral-300">
            {state === 'gameover' ? `Score: ${score} · Best: ${highScore}` : `Best: ${highScore}`}
          </p>
          <p className="rounded-full bg-gradient-to-r from-sunset-gold to-sunset-amber px-5 py-2 font-mono text-sm font-medium text-base-950">
            Click, tap, or press Space to {state === 'ready' ? 'start' : 'retry'}
          </p>
        </div>
      )}
    </div>
  )
}
