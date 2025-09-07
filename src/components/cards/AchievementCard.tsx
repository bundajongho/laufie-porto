import Badge from '@/components/common/Badge'
import { Trophy, Building2, Calendar } from 'lucide-react'
import { m, type Variants } from 'framer-motion'

/* Sheen: langsung mulai saat hover, tidak menyapu balik */
const sheenVariants: Variants = {
  rest: { x: '-120%', opacity: 0, transition: { duration: 0 } },
  hover: {
    x: '120%',
    opacity: 1,
    transition: {
      x: { duration: 1.35, ease: [0.22, 1, 0.36, 1] }, // smooth ease-out
      opacity: { duration: 0 },
    },
  },
}

/* Card lift + scale dengan tween simetris agar in/out halus */
const cardVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    y: -3,          // sedikit lebih tinggi, tetap subtle
    scale: 1.012,   // subtle scale
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
}

/* Glow halus dikontrol motion agar fade-in/out lembut */
const glowVariants: Variants = {
  rest: { opacity: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  hover: { opacity: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
}

export default function AchievementCard({
  title,
  org,
  year,
  badge,
  gradientFrom = 'var(--c2)',
  gradientTo = 'var(--c3)',
}: {
  title: string
  org: string
  year: string
  badge?: string
  gradientFrom?: string
  gradientTo?: string
}) {
  return (
    <m.div
      className="
        glass group relative overflow-hidden rounded-2xl p-5
        will-change-transform
        transition-[box-shadow,filter] duration-300 ease-out
        hover:ring-1 hover:ring-white/15
        hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_18px_60px_rgba(59,130,246,0.18)]
      "
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      {/* Soft glow saat hover (motion-animated) */}
      <m.span
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-[22px] blur-2xl"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 45%, rgba(59,130,246,0.22), rgba(59,130,246,0) 60%)',
          mixBlendMode: 'screen',
        }}
        variants={glowVariants}
      />

      {/* Kilau menyapu sekali */}
      <m.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            'linear-gradient(110deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 60%)',
          filter: 'blur(10px)',
        }}
        variants={sheenVariants}
      />

      <div className="relative z-[1] flex items-start gap-4">
        {/* Icon box dengan gradasi */}
        <div
          className="grid h-12 w-12 place-items-center rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 20px rgba(0,0,0,0.25)',
          }}
        >
          <Trophy className="text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            {/* Title gradasi */}
            <h4
              className="text-lg font-semibold text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              {title}
            </h4>

            {badge && <Badge className="-mt-1 bg-white/10">{badge}</Badge>}
          </div>

          {/* Org + Year (ikon warna khusus: company c2, year c3) */}
          <div className="mt-2 text-sm">
            <div className="flex items-center gap-2 text-white/85">
              <Building2 size={16} style={{ color: 'var(--c2)' }} />
              <span>{org}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-white/70">
              <Calendar size={16} style={{ color: 'var(--c3)' }} />
              <span>{year}</span>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  )
}