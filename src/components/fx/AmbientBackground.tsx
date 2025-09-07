import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function AmbientBackground() {
  // Mouse parallax normalized -1..1
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

  // Parallax lebih responsif (sedikit lebih cepat)
  const px = useSpring(nx, { stiffness: 120, damping: 18, mass: 0.7 })
  const py = useSpring(ny, { stiffness: 120, damping: 18, mass: 0.7 })

  // Offset parallax per layer (aurora utama + flow + beam)
  const a1x = useTransform(px, (v) => v * 40)
  const a1y = useTransform(py, (v) => v * 38)

  const flowX = useTransform(px, (v) => v * 16)
  const flowY = useTransform(py, (v) => v * 12)

  const b1x = useTransform(px, (v) => v * -8)
  const b1y = useTransform(py, (v) => v * 6)

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Single Aurora (top-left → bottom-right, faster) */}
      <m.div style={{ x: a1x, y: a1y }} className="absolute inset-0">
        <div className="amb-aurora amb-a1-fast" />
      </m.div>

      {/* Diagonal flow overlay (subtle, searah TL → BR) */}
      <m.div style={{ x: flowX, y: flowY }} className="absolute inset-0">
        <div className="amb-flow amb-flow-fast" />
      </m.div>

      {/* Single Beam: hanya TL → BR (TR → BL dihapus) */}
      <m.div style={{ x: b1x, y: b1y }} className="absolute inset-0">
        <div className="amb-beam amb-beam1-fast" />
      </m.div>
    </div>
  )
}