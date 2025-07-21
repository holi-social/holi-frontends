import type { PropsWithChildren } from 'react'
import React from 'react'

interface HoliFigmaSpanPlaceholderProps {
  'figma-seg'?: unknown
}

export const HoliFigmaSpanPlaceholder = (props: PropsWithChildren<HoliFigmaSpanPlaceholderProps>) => {
  return <>{props.children}</>
}
