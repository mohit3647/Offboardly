'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  phase: number
}

interface Signal {
  fromIdx: number
  toIdx: number
  progress: number
  speed: number
}

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Particle[] = []
    const signals: Signal[] = []
    const MAX_DIST = 220
    const PARTICLE_COUNT = 48

    const init = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particles.length = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: 1.5 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    init()
    window.addEventListener('resize', init)

    const fireSignal = () => {
      const from = Math.floor(Math.random() * particles.length)
      const a = particles[from]
      let best = -1
      let bestDist = Infinity
      particles.forEach((b, i) => {
        if (i === from) return
        const d = Math.hypot(b.x - a.x, b.y - a.y)
        if (d < MAX_DIST && d < bestDist) {
          bestDist = d
          best = i
        }
      })
      if (best >= 0) {
        signals.push({
          fromIdx: from,
          toIdx: best,
          progress: 0,
          speed: 0.006 + Math.random() * 0.01,
        })
      }
    }

    let tick = 0
    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tick++
      if (tick % 18 === 0) fireSignal()

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.phase += 0.014
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x
          const dy = particles[j].y - particles[i].y
          const dist = Math.hypot(dx, dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.22
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      // signals (neural impulses)
      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i]
        sig.progress += sig.speed
        if (sig.progress >= 1) {
          signals.splice(i, 1)
          continue
        }
        const a = particles[sig.fromIdx]
        const b = particles[sig.toIdx]
        const sx = a.x + (b.x - a.x) * sig.progress
        const sy = a.y + (b.y - a.y) * sig.progress
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 9)
        glow.addColorStop(0, 'rgba(6, 182, 212, 0.85)')
        glow.addColorStop(1, 'rgba(6, 182, 212, 0)')
        ctx.beginPath()
        ctx.arc(sx, sy, 9, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
        ctx.beginPath()
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#67e8f9'
        ctx.fill()
      }

      // neurons
      particles.forEach(p => {
        const pulse = 0.5 + 0.5 * Math.sin(p.phase)
        const outerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5)
        outerGlow.addColorStop(0, `rgba(139, 92, 246, ${0.35 * pulse})`)
        outerGlow.addColorStop(1, 'rgba(139, 92, 246, 0)')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2)
        ctx.fillStyle = outerGlow
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${0.65 + 0.35 * pulse})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', init)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}
