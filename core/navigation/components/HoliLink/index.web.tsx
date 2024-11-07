import Link from 'next/link'
import type { PropsWithChildren, SyntheticEvent } from 'react'
import React, { useCallback } from 'react'

import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'

export const HoliLink = ({
  href,
  label,
  external,
  onPress,
  children,
  isFullHeight = false,
  testID = 'link',
}: PropsWithChildren<HoliLinkProps>) => {
  const onLinkPress = useCallback(
    async (event: SyntheticEvent<HTMLAnchorElement, Event>) => {
      const stopPropagation = await onPress?.(event)
      if (stopPropagation === false) {
        event?.preventDefault()
        event?.stopPropagation()
        return false
      }
    },
    [onPress]
  )

  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      target={external ? '_blank' : undefined}
      onClick={onLinkPress}
      data-testid={testID}
      style={{ flex: isFullHeight ? 1 : 'auto' }}
    >
      {children}
    </Link>
  )
}
