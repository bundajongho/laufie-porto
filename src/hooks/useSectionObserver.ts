import { useEffect, useState } from 'react'

/**
 * Scroll‑spy stabil berbasis IntersectionObserver.
 * Zona trigger dipusatkan di layar (rootMargin -45%/-55%),
 * jadi section yang melintasi area tengah viewport akan dianggap aktif.
 */
export default function useSectionObserver(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] || '')

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Ambil entry yang intersecting dengan rasio terbesar; sebagai fallback gunakan yang paling atas (top terkecil)
        let bestId = active
        let bestRatio = -1
        let bestTop = Number.POSITIVE_INFINITY

        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = (entry.target as HTMLElement).id
          const ratio = entry.intersectionRatio
          const top = entry.boundingClientRect.top

          if (ratio > bestRatio || (ratio === bestRatio && top < bestTop)) {
            bestRatio = ratio
            bestTop = top
            bestId = id
          }
        }

        if (bestRatio >= 0 && bestId && bestId !== active) {
          setActive(bestId)
        }
      },
      {
        root: null,
        // Center band: ketika bagian tengah viewport memotong section
        rootMargin: '-45% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    elements.forEach((el) => observer.observe(el))

    // Set initial state berdasarkan posisi center viewport
    const centerY = window.innerHeight / 2
    const initial = elements.find((el) => {
      const r = el.getBoundingClientRect()
      return r.top <= centerY && r.bottom >= centerY
    })
    if (initial) setActive(initial.id)

    // Re-validate saat resize (IO akan fire ulang ketika layout berubah)
    const onResize = () => {
      // memicu callback IO dengan scroll micro-step
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event('scroll'))
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
    // ids saja yang jadi dependency; jangan masukkan "active" agar tidak re-init terus
  }, [ids])

  return active
}