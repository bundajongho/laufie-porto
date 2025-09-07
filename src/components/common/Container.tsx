import { cn } from '@/lib/utils'
import React from 'react'

export default function Container({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('mx-auto w-full max-w-container px-5 sm:px-6 md:px-8', className)}>{children}</div>
}