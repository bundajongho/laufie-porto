import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { createPortal } from 'react-dom'

type ToastVariant = 'success' | 'error' | 'info' | 'warning'

type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
  duration: number
}

type ToastContextValue = {
  toast: (message: string, opts?: { variant?: ToastVariant; duration?: number }) => string
  dismiss: (id: string) => void
  clear: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Record<string, number>>({})
  const portalEl = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let el = document.getElementById('toast-root') as HTMLElement | null
    if (!el) {
      el = document.createElement('div')
      el.id = 'toast-root'
      document.body.appendChild(el)
    }
    portalEl.current = el
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const toast = useCallback(
    (message: string, opts?: { variant?: ToastVariant; duration?: number }) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}_${Math.random()}`
      const item: ToastItem = {
        id,
        message,
        variant: opts?.variant ?? 'info',
        duration: opts?.duration ?? 10000, // default 10 detik
      }
      setToasts((prev) => [...prev, item])
      timers.current[id] = window.setTimeout(() => dismiss(id), item.duration) as unknown as number
      return id
    },
    [dismiss]
  )

  const clear = useCallback(() => {
    Object.values(timers.current).forEach((t) => window.clearTimeout(t))
    timers.current = {}
    setToasts([])
  }, [])

  useEffect(() => () => clear(), [clear])

  useEffect(() => {
    ;(window as any).__toast = (msg: string, opts?: { variant?: ToastVariant; duration?: number }) =>
      toast(msg, opts)
    return () => {
      delete (window as any).__toast
    }
  }, [toast])

  const value = useMemo(() => ({ toast, dismiss, clear }), [toast, dismiss, clear])

  const viewportStyle: React.CSSProperties = {
    position: 'fixed',
    right: 16,
    top: 16,
    zIndex: 2147483647,
    pointerEvents: 'none',
    width: 'min(92vw, 380px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}

      {portalEl.current &&
        createPortal(
          <div id="toast-viewport" style={viewportStyle}>
            {toasts.map((t) => (
              <ToastBubble key={t.id} item={t} onClose={() => dismiss(t.id)} />
            ))}
          </div>,
          portalEl.current
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

/* ============ Presentational ============ */
function ToastBubble({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const Icon = getIcon(item.variant)

  // Progress 1 → 0 (pakai RAF + transform scaleX untuk super smooth)
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    const start = performance.now()
    const dur = Math.max(1, item.duration)
    let raf = 0
    const tick = (now: number) => {
      const p = 1 - (now - start) / dur
      setProgress(p > 0 ? p : 0)
      if (p > 0) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [item.id, item.duration])

  // Alert bubble style (glass, border abu tipis, blur)
  const bubbleStyle: React.CSSProperties = {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(17,24,39,0.55)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  }

  const iconWrapStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 8,
    background: 'linear-gradient(135deg, var(--c2), var(--c3))',
    color: 'white',
    flex: '0 0 auto',
  }

  const closeStyle: React.CSSProperties = {
    position: 'absolute',
    right: 8,
    top: 8,
    opacity: 0.7,
    cursor: 'pointer',
    background: 'transparent',
    border: 0,
    color: 'white',
  }

  // Progress bar (tanpa track, pakai transform biar super halus)
  const barContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    overflow: 'hidden',
  }
  const barStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 3,
    width: '100%',
    transformOrigin: 'left',
    transform: `scaleX(${progress})`, // 1 → 0 mulus
    willChange: 'transform',
    background: 'linear-gradient(90deg, var(--c2), var(--c3))',
  }

  return (
    <div role="alert" aria-live="assertive" style={bubbleStyle}>
      <div style={iconWrapStyle} aria-hidden>
        <Icon size={18} />
      </div>
      <div style={{ paddingRight: 24, fontSize: 14, lineHeight: 1.4 }}>{item.message}</div>
      <button type="button" onClick={onClose} aria-label="Close notification" style={closeStyle}>
        <X size={16} />
      </button>

      {/* Progress di paling bawah, tanpa track abu-abu */}
      <div style={barContainerStyle} aria-hidden>
        <div style={barStyle} />
      </div>
    </div>
  )
}

function getIcon(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return CheckCircle2
    case 'warning':
      return AlertTriangle
    case 'error':
      return AlertCircle
    default:
      return Info
  }
}