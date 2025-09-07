import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import React from 'react'

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  )
}