import Container from './Container'
import React from 'react'
import { cn } from '@/lib/utils'

type Props = React.PropsWithChildren<{
  id: string
  className?: string
}>

export default function Section({ id, className, children }: Props) {
  return (
    <section id={id} aria-label={id} className={cn('py-20 md:py-28', className)}>
      <Container>{children}</Container>
    </section>
  )
}