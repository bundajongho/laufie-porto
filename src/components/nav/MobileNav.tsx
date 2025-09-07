import React, { useMemo, useState } from 'react'
import { navItems } from '@/data/nav'
import { cn } from '@/lib/utils'
import { m, AnimatePresence } from 'framer-motion'
import { Menu, Sun, X } from 'lucide-react'

type Props = {
  activeId?: string
  className?: string
}

export default function MobileNav({ activeId, className }: Props) {
  const items = useMemo(() => navItems, [])
  const active = items.find((n) => n.id === activeId) || items[0]
  const ActiveIcon = active.icon

  const [open, setOpen] = useState(false)

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    history.replaceState(null, '', `#${id}`)
  }

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <m.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      className={cn('fixed inset-x-0 bottom-0 z-[80] md:hidden', className)}
      aria-label="Mobile navigation"
    >
      {/* Tray bawah: chip + tombol menu (tanpa background memanjang) */}
      <div
        className="pointer-events-none mx-auto mb-3 flex w-full items-center justify-center"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="pointer-events-auto inline-flex items-center gap-2.5">
          {/* Chip kapsul gelap – icon + nama aktif, dengan shadow lebih tegas */}
          <div
            className="
              inline-flex items-center rounded-full
              border border-white/12 bg-black/40 px-4 py-2.5
              backdrop-blur-xl
              shadow-[0_12px_30px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]
            "
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={active.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2.5"
              >
                <ActiveIcon size={16} className="text-white/90" />
                <span className="text-sm font-semibold text-white">{active.label}</span>
              </m.div>
            </AnimatePresence>
          </div>

          {/* Tombol menu bulat biru – glow + shadow multi-layer */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="
              grid h-12 w-12 place-items-center rounded-full text-white
              ring-1 ring-white/20
              shadow-[0_18px_44px_rgba(0,98,255,0.55),0_8px_20px_rgba(0,0,0,0.35)]
              transition-transform duration-150 active:scale-95
            "
            style={{ background: 'linear-gradient(135deg, var(--c2), var(--c3))' }}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Sheet navigation */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/60"
              onClick={() => setOpen(false)}
            />

            {/* Panel bawah: background hitam, grid tile 2 kolom */}
            <m.div
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="
                fixed inset-x-0 bottom-0 z-[95]
                rounded-t-[22px] border border-white/10 bg-black p-4 pb-5
                shadow-[0_-20px_50px_rgba(0,0,0,0.6)]
              "
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Navigation</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="
                    grid h-8 w-8 place-items-center rounded-lg
                    border border-white/0 bg-white/0 text-white/85
                    hover:bg-white/5 transition-colors
                  "
                >
                  <X size={16} />
                </button>
              </div>

              {/* Grid tiles – icon di atas nama; non-aktif abu, aktif gradient c2→c3→c4 */}
              <div className="grid grid-cols-2 gap-3">
                {items.map((it) => {
                  const Icon = it.icon
                  const isActive = activeId === it.id

                  return (
                    <a
                      key={it.id}
                      href={`#${it.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        setOpen(false)
                        setTimeout(() => scrollToId(it.id), 10)
                      }}
                      className={cn(
                        'group relative overflow-hidden rounded-2xl p-5 text-center transition-transform duration-200 hover:scale-[1.01]',
                        isActive ? 'text-white' : 'text-white/90'
                      )}
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, var(--c2), var(--c3), var(--c4))'
                          : 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.14)',
                      }}
                    >
                      {/* Highlight diagonal lembut untuk aktif */}
                      {isActive && (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-2xl opacity-70"
                          style={{
                            background:
                              'linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0) 65%)',
                            filter: 'blur(22px)',
                            mixBlendMode: 'screen',
                          }}
                        />
                      )}

                      <div className="relative z-[1] flex flex-col items-center gap-2">
                        <Icon size={20} />
                        <span className={cn('text-base', isActive && 'font-semibold')}>
                          {it.label}
                        </span>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Light Mode – outline, minimalis */}
              <button
                type="button"
                onClick={toggleTheme}
                className="
                  mt-5 w-full rounded-xl
                  border border-white/14 bg-transparent
                  px-4 py-3 text-white/90
                  hover:bg-white/[0.06] transition-colors
                  flex items-center justify-center gap-2
                "
              >
                <Sun size={16} />
                <span>Light Mode</span>
              </button>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </m.nav>
  )
}