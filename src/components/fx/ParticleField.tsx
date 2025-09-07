import { m, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useMemo } from 'react'

type Orb = { x: number; y: number; size: number; amp: number; speed: number; delay: number; hue: number }
const rand = (a: number, b: number) => Math.random() * (b - a) + a

export default function ParticleField({ count = 24 }: { count?: number }) {
  // Parallax interaktif
  const nx = useMotionValue<number>(0)
  const ny = useMotionValue<number>(0)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      nx.set((e.clientX - cx) / cx)
      ny.set((e.clientY - cy) / cy)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [nx, ny])

  const px = useSpring(nx, { stiffness: 90, damping: 22 })
  const py = useSpring(ny, { stiffness: 90, damping: 22 })

  // Waktu
  const t = useMotionValue<number>(0)
  useAnimationFrame((time) => t.set(time))

  // Orbs kecil (subtle)
  const orbs = useMemo<Orb[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: rand(4, 96),
        y: rand(4, 96),
        size: rand(3, 6),
        amp: rand(8, 18),
        speed: rand(3200, 6200),
        delay: rand(0, 1800) + i * 60,
        hue: rand(205, 230),
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {orbs.map((o, i) => {
        // Drift sin/cos + parallax kecil
        const dx = useTransform([t, px], ([time, p]: [number, number]) => Math.sin((time + o.delay) / o.speed) * o.amp + p * (o.amp * 0.6))
        const dy = useTransform([t, py], ([time, p]: [number, number]) => Math.cos((time + o.delay) / o.speed) * o.amp + p * (o.amp * 0.5))
        const scale = useTransform(t, (time: number) => 1 + Math.sin((time + o.delay) / (o.speed * 1.6)) * 0.12)

        return (
          <m.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${o.x}%`,
              top: `${o.y}%`,
              width: o.size,
              height: o.size,
              x: dx,
              y: dy,
              scale,
              background: `radial-gradient(circle at 30% 30%, hsla(${o.hue}, 100%, 70%, 0.9), hsla(${o.hue}, 100%, 60%, 0.25) 60%, transparent 70%)`,
              filter: 'blur(0.7px)',
              mixBlendMode: 'screen',
              opacity: 0.9,
            }}
          />
        )
      })}
    </div>
  )
}