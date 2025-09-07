import useScrollProgress from '@/hooks/useScrollProgress'
import { formatPercent } from '@/lib/utils'

export default function CircleProgress() {
  const p = useScrollProgress()
  const size = 48
  const stroke = 2
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  const offset = C * (1 - p)

  return (
    <button
      aria-label="Scroll progress"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 grid place-items-center rounded-full bg-black/40 p-1.5 backdrop-blur-xl border border-white/10"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.12)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#grad4)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={C}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="grad4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EEF4FF" />
            <stop offset="35%" stopColor="#60A5FA" />
            <stop offset="70%" stopColor="#0062FF" />
            <stop offset="100%" stopColor="#0013BE" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-[11px] font-semibold text-white/80">{formatPercent(p)}</span>
    </button>
  )
}