import { useEffect, useRef } from 'react'

/**
 * Federation Constellation — animated particle network backdrop.
 * Lightweight canvas2D. No external libs. Subtle, responsive, mouse-reactive.
 * Represents the arifOS federation mesh as living geometry.
 */

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
  // 0 = organ node (larger, brighter), 1 = connection particle (smaller, dimmer)
  kind: 0 | 1
}

const COLORS = {
  gold: [201, 162, 39],
  dim: [154, 160, 168],
  accent: [56, 189, 248],
} as const

const CONNECTION_DIST = 140
const MOUSE_RADIUS = 180
const MOUSE_STRENGTH = 0.015
const ORGAN_COUNT = 8
const PARTICLE_COUNT = 60

function createParticles(w: number, h: number): Particle[] {
  const particles: Particle[] = []
  // Organ nodes — larger, golden
  for (let i = 0; i < ORGAN_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 2.5 + Math.random() * 1.5,
      alpha: 0.6 + Math.random() * 0.3,
      kind: 0,
    })
  }
  // Connection particles — smaller, dimmer
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: 0.8 + Math.random() * 1,
      alpha: 0.15 + Math.random() * 0.25,
      kind: 1,
    })
  }
  return particles
}

export function FederationConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.parentElement?.clientWidth ?? window.innerWidth
    let h = canvas.parentElement?.clientHeight ?? window.innerHeight
    canvas.width = w
    canvas.height = h

    let particles = createParticles(w, h)
    let raf: number

    const onResize = () => {
      w = canvas.parentElement?.clientWidth ?? window.innerWidth
      h = canvas.parentElement?.clientHeight ?? window.innerHeight
      canvas.width = w
      canvas.height = h
      particles = createParticles(w, h)
    }

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onMouseLeave = () => {
      mouseRef.current = null
    }

    window.addEventListener('resize', onResize)
    canvas.addEventListener('mousemove', onMouse)
    canvas.addEventListener('mouseleave', onMouseLeave)

    function frame() {
      ctx!.clearRect(0, 0, w, h)
      const mouse = mouseRef.current

      // Update & draw particles
      for (const p of particles) {
        // Mouse attraction
        if (mouse) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        // Apply velocity with damping
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        // Wrap edges
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        // Draw particle
        const col = p.kind === 0 ? COLORS.gold : COLORS.dim
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${p.alpha})`
        ctx!.fill()

        // Glow for organ nodes
        if (p.kind === 0) {
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(${COLORS.gold[0]},${COLORS.gold[1]},${COLORS.gold[2]},${p.alpha * 0.1})`
          ctx!.fill()
        }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15
            // Organ-to-organ connections are gold, others are dim
            const isOrgPair = a.kind === 0 && b.kind === 0
            const col = isOrgPair ? COLORS.gold : COLORS.dim
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`
            ctx!.lineWidth = isOrgPair ? 1 : 0.5
            ctx!.stroke()
          }
        }
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousemove', onMouse)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ opacity: 0.4 }}
      aria-hidden="true"
    />
  )
}

export default FederationConstellation
