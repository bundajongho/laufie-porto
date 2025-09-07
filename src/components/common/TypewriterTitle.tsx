import { useEffect, useRef, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import {
  Code2,
  Brain,
  PenTool,
  MessageSquareText,
  Cpu,
  Rocket,
} from 'lucide-react'

type Phase = 'typing' | 'pausing' | 'deleting' | 'switching'

type Props = {
  className?: string
  onVacancyChange?: (isEmpty: boolean) => void // opsional; true saat jeda kosong
}

const ROLES = [
  { label: 'Creative Developer', Icon: Code2 },
  { label: 'Data Scientist', Icon: Brain },
  { label: 'Graphic Designer', Icon: PenTool },
  { label: 'Prompt Engineer', Icon: MessageSquareText },
  { label: 'AI Engineer', Icon: Cpu },
  { label: 'Young Entrepreneur', Icon: Rocket },
] as const

// Kecepatan
const TYPE_MS = 85
const DELETE_MS = 55
const HOLD_MS = 2000
const SWITCH_GAP_MS = 250 // jeda kosong antar title

export default function TypewriterTitle({ className, onVacancyChange }: Props) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')
  const [subIdx, setSubIdx] = useState(0)

  const prevEmpty = useRef<boolean>(false)

  useEffect(() => {
    const full = ROLES[roleIndex].label
    let t: number | undefined

    if (phase === 'typing') {
      if (subIdx < full.length) {
        t = window.setTimeout(() => setSubIdx((v) => v + 1), TYPE_MS)
      } else {
        t = window.setTimeout(() => setPhase('pausing'), 50)
      }
    } else if (phase === 'pausing') {
      t = window.setTimeout(() => setPhase('deleting'), HOLD_MS)
    } else if (phase === 'deleting') {
      if (subIdx > 0) {
        t = window.setTimeout(() => setSubIdx((v) => Math.max(0, v - 1)), DELETE_MS)
      } else {
        // ganti role, lalu tahan kosong sebentar
        setRoleIndex((v) => (v + 1) % ROLES.length)
        setPhase('switching')
      }
    } else if (phase === 'switching') {
      t = window.setTimeout(() => {
        setPhase('typing')
        setSubIdx(0)
      }, SWITCH_GAP_MS)
    }

    return () => { if (t) clearTimeout(t) }
  }, [phase, subIdx, roleIndex])

  // Beritahu parent saat kosong/terisi (kalau dipakai)
  const isEmpty = phase === 'switching'
  useEffect(() => {
    if (prevEmpty.current !== isEmpty) {
      onVacancyChange?.(isEmpty)
      prevEmpty.current = isEmpty
    }
  }, [isEmpty, onVacancyChange])

  const CurrentText = ROLES[roleIndex].label.slice(0, subIdx)
  const CurrentIcon = ROLES[roleIndex].Icon

  return (
    <span
      className={`inline-flex items-center leading-tight h-[2.0em] md:h-[2.1em] ${className ?? ''}`}
      // h tetap supaya stabil meski teks kosong
    >
      {/* Text dengan efek turun saat mengetik */}
      <span className="whitespace-pre nowrap">
        {Array.from(CurrentText).map((ch, i) => (
          <m.span
            key={`${roleIndex}-${i}`}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="inline-block"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </m.span>
        ))}
      </span>

      {/* Caret: blink + scale (lebih animated) */}
      <m.span
        className="ml-2 inline-block align-middle h-[1.2em] w-[2px] bg-white/90 shadow-[0_0_12px_rgba(96,165,250,0.9)]"
        animate={{ opacity: [1, 0.2, 1], scaleY: [1, 1.25, 1] }}
        transition={{ duration: 0.9, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.1 }}
        style={{ transformOrigin: '50% 50%' }}
      />

      {/* Ikon: lama rotate ke kanan + fade; baru dari -90deg → 0deg + fade in */}
      <AnimatePresence mode="wait">
        <m.span
          key={roleIndex}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
          className="ml-3 text-blue-400/90"
        >
          <CurrentIcon size={22} strokeWidth={1.8} />
        </m.span>
      </AnimatePresence>
    </span>
  )
}