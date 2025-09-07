import Section from '@/components/common/Section'
import SectionHeading from '@/components/common/SectionHeading'
import { projects } from '@/data/projects'
import ProjectCard from '@/components/cards/ProjectCard'
import { useEffect, useMemo, useRef, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useToast } from '@/providers/ToastProvider'

type TabKey = 'all' | 'web' | 'mobile'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All Projects' },
  { key: 'web', label: 'Web Apps' },
  { key: 'mobile', label: 'Mobile' },
]

// Cocokkan project ke tab aktif:
// 1) pakai p.categories jika ada
// 2) fallback p.category jika ada
// 3) heuristik lama (mobile/react native => mobile, else web)
function matchesTab(p: (typeof projects)[number], tab: TabKey): boolean {
  if (tab === 'all') return true

  const cats =
    ((p as any).categories as TabKey[] | undefined) ??
    (((p as any).category as TabKey | undefined) ? [((p as any).category as TabKey)] : undefined)

  if (cats?.includes(tab)) return true

  const s = (p.title + ' ' + p.techs.join(' ')).toLowerCase()
  const isMobile = s.includes('mobile') || s.includes('react native')
  return tab === (isMobile ? 'mobile' : 'web')
}

export default function ProjectsSection() {
  const [active, setActive] = useState<TabKey>('all')
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const listRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { toast } = useToast()

  const showUnavailable = () => {
    toast('This project is not available.', { variant: 'info' })
  }

  const filtered = useMemo(() => {
    if (active === 'all') return projects
    return projects.filter((p) => matchesTab(p, active))
  }, [active])

  const updatePill = () => {
    const idx = TABS.findIndex((t) => t.key === active)
    const btn = btnRefs.current[idx]
    if (btn) {
      setPill({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
  }

  useEffect(() => {
    updatePill()
    const onResize = () => updatePill()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <Section id="projects">
      <SectionHeading
        title="Projects"
        highlight="Collection"
        subtitle="A collection of projects that showcase my skills in full‑stack development, UI/UX design, and modern web technologies."
      />

      {/* Tabs with animated pill */}
      <div className="mx-auto mb-8 w-max rounded-2xl border border-white/10 bg-white/[0.02] p-1 backdrop-blur-sm">
        <div
          ref={listRef}
          role="tablist"
          aria-label="Projects filter"
          className="relative flex gap-1"
        >
          {/* moving pill */}
          <m.span
            className="pointer-events-none absolute top-1 bottom-1 rounded-xl"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.35) 0%, var(--c3) 100%)',
              opacity: 0.9,
              backdropFilter: 'blur(6px)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 20px rgba(0,0,0,0.25)',
            }}
            animate={{ left: pill.left + 2, width: Math.max(0, pill.width - 4) }}
            transition={{ type: 'spring', stiffness: 460, damping: 32, mass: 0.6 }}
          />

          {TABS.map((t, i) => {
            const isActive = active === t.key
            return (
              <button
                key={t.key}
                ref={(el) => { btnRefs.current[i] = el }}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(t.key)}
                className="relative rounded-xl px-4 py-2 text-sm text-white/85 transition-colors"
              >
                <span className={`relative z-10 ${isActive ? 'font-semibold text-white' : 'hover:text-white'}`}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid with fade out/in when switching category */}
      <AnimatePresence mode="wait">
        <m.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                title={p.title}
                description={p.description}
                image={p.images[0]?.src}
                techs={p.techs}
                status={p.status}
                demo={p.links.find((l) => l.type === 'demo')?.url}
                repo={p.links.find((l) => l.type === 'repo')?.url}
                onUnavailable={showUnavailable}
              />
            ))}
          </div>
        </m.div>
      </AnimatePresence>
    </Section>
  )
}