import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export default function ImageWithFallback({
  src,
  alt,
  fallback = '/og-image.png',
  className,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }) {
  const [error, setError] = useState(false)
  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
      className={cn('object-cover', className)}
      {...rest}
    />
  )
}