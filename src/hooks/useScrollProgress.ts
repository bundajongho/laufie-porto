import { useEffect, useRef, useState } from 'react'

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n))
}

export default function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const maxRef = useRef(1)

  const getRoot = () =>
    (document.scrollingElement as HTMLElement) || document.documentElement

  const recalc = () => {
    const root = getRoot()
    // total jarak scroll = tinggi konten - tinggi viewport
    const max = Math.max(1, root.scrollHeight - root.clientHeight)
    maxRef.current = max
    // update nilai awal
    const top = root.scrollTop
    setProgress(clamp(top / max, 0, 1))
  }

  const onScroll = () => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      const root = getRoot()
      const top = root.scrollTop
      const max = maxRef.current
      setProgress(clamp(top / max, 0, 1))
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    })
  }

  useEffect(() => {
    // initial measure
    recalc()

    // listener scroll + resize
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', recalc)
    window.addEventListener('orientationchange', recalc)
    window.addEventListener('load', recalc)

    // jika DOM berubah (gambar lazy load, dsb.)
    const mo = new MutationObserver(() => recalc())
    mo.observe(document.body, { childList: true, subtree: true })

    // jika ada gambar yang belum complete, tunggu lalu recalc
    const imgs = Array.from(document.images)
    const onImg = () => recalc()
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', onImg)
        img.addEventListener('error', onImg)
      }
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', recalc)
      window.removeEventListener('orientationchange', recalc)
      window.removeEventListener('load', recalc)
      mo.disconnect()
      imgs.forEach((img) => {
        img.removeEventListener('load', onImg)
        img.removeEventListener('error', onImg)
      })
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return progress
}