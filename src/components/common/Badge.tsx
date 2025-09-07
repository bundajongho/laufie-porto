import { cn } from '@/lib/utils'
import { m } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

type Props = React.PropsWithChildren<{ className?: string }>

const BASE_BG = 'rgba(255,255,255,0.10)'
const HOVER_BG = BASE_BG

export default function Badge({ children, className }: Props) {
  const rootRef = useRef<HTMLSpanElement | null>(null)
  const innerRef = useRef<HTMLSpanElement | null>(null)
  const [sweepKey, setSweepKey] = useState(0)

  const [inProjects, setInProjects] = useState(false)
  const [inAchievements, setInAchievements] = useState(false)

  useEffect(() => {
    if (!rootRef.current) return
    setInProjects(Boolean(rootRef.current.closest('#projects')))
    setInAchievements(Boolean(rootRef.current.closest('#achievements')))
  }, [])

  const handleMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = innerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  // Ukuran:
  // - Default: besar
  // - Projects: kecil
  // - Achievements: lebih kecil dari Projects
  const sizeDefault = 'px-4 py-2 text-sm'
  const sizeProjects = 'px-3 py-1.5 text-[12px] leading-[1.15]'
  const sizeAchievements = 'px-2 py-[2px] text-[11px] leading-[1.1]'

  const sizeClass = inAchievements
    ? sizeAchievements
    : inProjects
    ? sizeProjects
    : sizeDefault

  // Motion halus (sedikit lebih kecil untuk badge mini)
  const hoverMotion =
    inAchievements ? { y: -1, scale: 1.01 } : inProjects ? { y: -1, scale: 1.01 } : { y: -2, scale: 1.02 }
  const tapMotion = inAchievements || inProjects ? { scale: 0.995 } : { scale: 0.98 }

  // Titik aksen
  const dotClass = inAchievements ? 'h-1 w-1' : inProjects ? 'h-1.5 w-1.5' : 'h-2 w-2'

  // Ring/glare (sama untuk semua, cukup subtle)
  return (
    <m.span
      ref={rootRef}
      className={cn('group relative inline-flex items-center rounded-full p-[1.5px] isolate', className)}
      whileHover={hoverMotion}
      whileTap={tapMotion}
      transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.6 }}
    >
      {/* Ring luar subtle */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-5 blur-[2px] transition-opacity duration-300 group-hover:opacity-20"
        style={{ background: 'var(--grad-4)' }}
      />

      {/* Inner pill */}
      <m.span
        ref={innerRef}
        onMouseMove={handleMove}
        onMouseLeave={() => {
          if (innerRef.current) {
            innerRef.current.style.removeProperty('--mx')
            innerRef.current.style.removeProperty('--my')
          }
        }}
        onMouseEnter={() => setSweepKey((k) => k + 1)}
        className={cn(
          'relative z-[1] inline-flex items-center gap-2 rounded-full border border-white/10 overflow-hidden text-white/90 backdrop-blur-xl',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_18px_rgba(0,0,0,0.22)] transition-colors duration-300',
          sizeClass
        )}
        style={{ backgroundColor: BASE_BG }}
        whileHover={{ backgroundColor: HOVER_BG }}
        animate={{ scale: [1, 1.005, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Titik aksen */}
        <span
          aria-hidden
          className={cn('rounded-full bg-[rgba(96,165,250,0.85)] shadow-[0_0_10px_rgba(96,165,250,0.85)]', dotClass)}
        />
        <span className={cn('font-medium', (inProjects || inAchievements) && 'font-normal')}>{children}</span>

        {/* Sweep kilau sekali tiap hover */}
        <m.span
          key={sweepKey}
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full mix-blend-screen"
          style={{
            background:
              'linear-gradient(112deg, rgba(255,255,255,0) 28%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 72%)',
            filter: inAchievements ? 'blur(8px)' : 'blur(10px)',
          }}
          initial={{ x: '-135%', opacity: 0 }}
          animate={{ x: '135%', opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />

        {/* Glare mengikuti kursor */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-full mix-blend-screen transition-opacity duration-150',
            inAchievements ? 'opacity-0 group-hover:opacity-40 blur-[10px]' : 'opacity-0 group-hover:opacity-50 blur-[12px]'
          )}
          style={{
            background:
              'radial-gradient(140px 90px at var(--mx, -40px) calc(var(--my, -40px) - 20px), rgba(255,255,255,0.28), rgba(255,255,255,0.08) 55%, rgba(255,255,255,0) 72%)',
          }}
        />
      </m.span>
    </m.span>
  )
}