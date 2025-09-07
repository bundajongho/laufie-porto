import Section from '@/components/common/Section'
import { m } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/motion/variants'
import { Download, ArrowRight, Sparkles, Star, Palette, ChevronDown } from 'lucide-react'
import HeroOrbit from '@/components/fx/HeroOrbit'
import TypewriterTitle from '@/components/common/TypewriterTitle'
import { useState } from 'react'
import SocialButtons from '@/components/common/SocialButtons'
import { useToast } from '@/providers/ToastProvider'

type CTAButtonProps = {
  href: string
  label: string
  icon: React.ReactNode
  variant: 'primary' | 'outline'
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  downloadName?: string
}

// CTA dengan fill-wipe: solid c3 <-> outline saat hover
function CTAButton({ href, label, icon, variant, onClick, downloadName }: CTAButtonProps) {
  const [hovered, setHovered] = useState(false)
  const isSolid = variant === 'primary' ? !hovered : hovered

  return (
    <a
      href={href}
      onClick={onClick}
      download={downloadName ? downloadName : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium overflow-hidden transition-all duration-200 ${
        isSolid ? 'text-white' : 'border border-white/15 bg-white/5 text-white'
      }`}
      style={isSolid ? { background: 'transparent' } : undefined}
    >
      <m.span
        aria-hidden
        className="absolute inset-y-0 left-0 rounded-xl"
        style={{ background: 'var(--c3)' }}
        animate={{ width: isSolid ? '100%' : '0%' }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{label}</span>
      <m.span
        className="relative z-10"
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      >
        {icon}
      </m.span>
    </a>
  )
}

export default function HomeSection() {
  const { toast } = useToast()
  const cvUrl = `${import.meta.env.BASE_URL}laufie-cv.pdf`

  const handleDownloadCV = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    try {
      const resp = await fetch(cvUrl, { method: 'GET', cache: 'no-store' })
      if (!resp.ok) {
        toast('File not available.', { variant: 'error' })
        return
      }

      const ct = (resp.headers.get('content-type') || '').toLowerCase()
      const buf = await resp.arrayBuffer()
      const sig = new Uint8Array(buf.slice(0, 4))
      const isPDFSig = sig[0] === 0x25 && sig[1] === 0x50 && sig[2] === 0x44 && sig[3] === 0x46
      const isPDFType = ct.includes('pdf')

      if (!isPDFSig && !isPDFType) {
        toast('File not available.', { variant: 'error' })
        return
      }

      const blob = new Blob([buf], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Laufie-Alexandria-CV.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    } catch {
      toast('File not available.', { variant: 'error' })
    }
  }

  return (
    <Section id="home" className="pt-36 relative">
      {/* Mobile/Tablet: 1 kolom; Desktop (lg+): 2 kolom */}
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Left column (konten) — urutan kedua di mobile/tablet; center di mobile/tablet */}
        <m.div
          variants={staggerContainer()}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="
            relative transform-gpu
            lg:-translate-y-6 xl:-translate-y-8
            order-2 lg:order-1
            text-center lg:text-left
          "
        >
          <m.h1
            variants={fadeInUp}
            className="font-bold"
            style={{ fontSize: 'clamp(36px, 6.5vw, 74px)', lineHeight: 1.04 }}
          >
            <span className="title-gradient inline-block">Laufie</span>
            <br />
            <span className="title-gradient inline-block">Alexandria</span>
          </m.h1>

          {/* Title */}
          <m.p
            variants={fadeInUp}
            className="mt-6 font-mono"
            style={{ fontSize: 'clamp(20px, 4.5vw, 32px)' }}
          >
            <TypewriterTitle />
          </m.p>

          {/* Deskripsi */}
          <m.p variants={fadeInUp} className="mt-6 text-white/70">
            I blend logic and creativity to craft smart, data-driven, and user-friendly solutions—whether
            through clean code, insightful analysis, or intuitive design.
          </m.p>

          {/* CTA — center di mobile/tablet, left di desktop */}
          <m.div
            variants={fadeInUp}
            className="mt-8 flex flex-wrap items-center gap-3 justify-center lg:justify-start"
          >
            <CTAButton href="#about" label="View More" variant="primary" icon={<ArrowRight size={18} />} />
            <CTAButton
              href={cvUrl}
              label="Download CV"
              variant="outline"
              icon={<Download size={18} />}
              downloadName="Laufie-Alexandria-CV.pdf"
              onClick={handleDownloadCV}
            />
          </m.div>

          {/* Socials — center di mobile/tablet */}
          <m.div variants={fadeInUp} className="mt-6 flex justify-center lg:block">
            <SocialButtons />
          </m.div>

          {/* Decorative floaters (desktop only) */}
          <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" aria-hidden="true">
            <m.span
              className="absolute left-[62%] top-[-12px] h-2.5 w-2.5 rounded-full bg-primary-300/80 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <m.span
              className="absolute right-[-22px] top-[8%] h-6 w-6 rounded-lg bg-primary-500/20 border border-white/10 backdrop-blur-[2px]"
              animate={{ rotate: [0, 25, 0, -25, 0], y: [0, -8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <m.span
              className="absolute left-[185px] top-[62%] h-2 w-2 rounded-full bg-primary-400/80"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
            <m.div
              className="absolute left-[-32px] top-[6%] text-primary-300/80"
              animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={18} />
            </m.div>
            <m.div
              className="absolute left-[70%] top-[36%] text-primary-400/70"
              animate={{ x: [0, 10, 0], rotate: [0, -12, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Palette size={18} />
            </m.div>
            <m.div
              className="absolute left-[8%] top-[58%] text-primary-200/80"
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Star size={14} />
            </m.div>
            <m.div
              className="absolute left-[84%] top-[4%] text-primary-300/60"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4], rotate: [0, 30, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Star size={12} />
            </m.div>
          </div>
        </m.div>

        {/* Right column (avatar + orbit) — mobile/tablet: muncul dulu, dinaikkan; desktop: rata kanan */}
        <div
          className="
            order-1 lg:order-2
            self-center lg:justify-self-end
            transform-gpu
            lg:-translate-y-6 xl:-translate-y-12 lg:translate-x-6 xl:translate-x-12 2xl:translate-x-16
            -mt-6 sm:-mt-10 md:-mt-12 lg:mt-0
            scale-[0.86] sm:scale-[0.9] md:scale-[0.86] lg:scale-100
          "
        >
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <HeroOrbit />
          </m.div>
        </div>
      </div>

      {/* Scroll to explore — hanya desktop (lg+) */}
      <div className="hidden lg:flex absolute inset-x-0 bottom-20 md:bottom-24 flex-col items-center justify-center">
        <m.a
          href="#about"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto group flex flex-col items-center text-sm text-white/60 hover:text-white"
          aria-label="Scroll to explore"
        >
          <span>Scroll to explore</span>
          <m.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-1 text-white/70 group-hover:text-white"
            aria-hidden="true"
          >
            <ChevronDown size={18} />
          </m.span>
        </m.a>
      </div>
    </Section>
  )
}