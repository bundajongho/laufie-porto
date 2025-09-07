import { useEffect } from 'react'

export default function useHashSync(activeId: string) {
  useEffect(() => {
    if (!activeId) return
    history.replaceState(null, '', `#${activeId}`)
  }, [activeId])
}