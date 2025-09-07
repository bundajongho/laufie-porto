import { ArrowUp } from 'lucide-react'
import { AnimatePresence, m } from 'framer-motion'
import React from 'react'

export default function ScrollTopButton({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <m.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-28 right-8 z-40 glass rounded-xl p-3"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ArrowUp />
        </m.button>
      )}
    </AnimatePresence>
  )
}