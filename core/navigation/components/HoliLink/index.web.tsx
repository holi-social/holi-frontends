import Link from 'next/link'
import type { SyntheticEvent } from 'react'
import React, { useCallback } from 'react'
import type { PropsWithChildren } from 'react'

import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'

export const HoliLink = ({
  href,
  label,
  external,
  onPress,
  children,
  testID = 'link',
}: PropsWithChildren<HoliLinkProps>) => {
  const onLinkPress = useCallback(
    (event: SyntheticEvent<HTMLAnchorElement, Event>) => {
      const stopPropagation = onPress?.(event)
      if (stopPropagation === false) {
        event?.preventDefault()
        event?.stopPropagation()
        return false
      }
    },
    [onPress]
  )

  return (
    <Link href={href}>
      <a
        aria-label={label}
        title={label}
        target={external ? '_blank' : undefined}
        onClick={onLinkPress}
        data-testid={testID}
      >
        {children}
      </a>
    </Link>
  )
}
