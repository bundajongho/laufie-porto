export const t = {
  fast: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } as const,
  normal: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as const,
  slow: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as const,
  spring: { type: 'spring', stiffness: 220, damping: 26, mass: 0.9 } as const,
}