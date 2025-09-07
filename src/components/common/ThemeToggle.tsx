import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'
import { cn } from '@/lib/utils'

type Variant = 'glass' | 'dock' | 'bare'

export default function ThemeToggle({
  className,
  variant = 'glass',
}: {
  className?: string
  variant?: Variant
}) {
  const { setTheme } = useTheme()
  const isDark = document.documentElement.classList.contains('dark')

  const base =
    variant === 'bare'
      ? 'inline-grid place-items-center p-2 text-white/70 hover:text-white bg-transparent'
      : 'inline-flex items-center justify-center rounded-xl'

  const styles =
    variant === 'dock'
      ? 'h-9 w-9 border border-white/10 bg-white/5 hover:bg-white/10 ring-1 ring-white/5'
      : variant === 'glass'
      ? 'h-10 w-10 glass hover:shadow-glow'
      : '' // bare: tanpa border/background

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(base, styles, className)}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}