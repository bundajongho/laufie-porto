import React from 'react'
import { socials } from '@/data/socials'
import { cn } from '@/lib/utils'

function SocialButton({
  href,
  label,
  children,
}: {
  href: string
  label?: string
  children: React.ReactNode
}) {
  return (
    <div className="group relative inline-block">
      <a
        href={href}
        className="glass grid h-12 w-12 place-items-center rounded-xl transition-transform duration-200 group-hover:rotate-45 relative"
        target="_blank"
        rel="noreferrer"
        aria-label={label}
      >
        {/* Icon counter-rotate agar tetap tegak */}
        <span className="transition-transform duration-200 group-hover:-rotate-45">
          {children}
        </span>

        {/* Border gradient muncul saat hover (mask ke pinggir) */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[14px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background: 'var(--grad-4)',
            padding: '2px',
            WebkitMask:
              'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            filter: 'blur(0.5px)',
          }}
        />
      </a>
    </div>
  )
}

export default function SocialButtons({
  className,
  items = socials,
}: {
  className?: string
  items?: typeof socials
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {items.map(({ label, icon: Icon, url }) => (
        <SocialButton key={label} href={url} label={label}>
          <Icon />
        </SocialButton>
      ))}
    </div>
  )
}