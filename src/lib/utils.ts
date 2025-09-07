import { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n))
}

export function formatPercent(n: number) {
  return `${Math.round(n * 100)}%`
}