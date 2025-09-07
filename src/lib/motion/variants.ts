import { Variants } from 'framer-motion'
import { t } from './transitions'

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0)', transition: t.normal },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: t.normal },
}

export const staggerContainer = (stagger = 0.08): Variants => ({
  initial: {},
  animate: { transition: { staggerChildren: stagger, delayChildren: 0.1 } },
})

export const hoverLift: Variants = {
  initial: { y: 0 },
  whileHover: { y: -4, transition: t.fast },
}