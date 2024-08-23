import Link from 'next/link'
import type { PropsWithChildren, SyntheticEvent } from 'react'
import React, { useCallback } from 'react'

import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import { HoliNavHistory } from '@holi/core/navigation/helpers/HoliNavHistory'

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
    (event: SyntheticEvent<HTMLAnchorElement, Event>) => {
      href && HoliNavHistory.add(href)
      const stopPropagation = onPress?.(event)
      if (stopPropagation === false) {
        event?.preventDefault()
        event?.stopPropagation()
        return false
      }
    },
    [href, onPress]
  )

  return (
    <Link
      href={href || ''}
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
