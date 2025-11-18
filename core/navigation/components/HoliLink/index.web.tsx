import Link from 'next/link'
import type { PropsWithChildren, SyntheticEvent } from 'react'
import React, { useCallback } from 'react'

import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import { useWebHistory } from '@holi/core/navigation/hooks/useWebHistory'

export const HoliLink = ({
  href,
  label,
  external,
  onPress,
  children,
  isFullHeight = false,
  testID = 'link',
  replace,
}: PropsWithChildren<HoliLinkProps>) => {
  const { push, replace: replaceRoute } = useWebHistory()
  const onLinkPress = useCallback(
    async (event: SyntheticEvent<HTMLAnchorElement, Event>) => {
      // Async onPress callbacks won't be awaited before event propagation
      const propagateEventOrPromise = onPress?.(event)
      if (propagateEventOrPromise === false) {
        event?.preventDefault()
        event?.stopPropagation()
        return false
      }
      // Sync web history
      if (replace) {
        replaceRoute(href)
      } else {
        push(href)
      }
      await propagateEventOrPromise
    },
    [href, onPress, push, replace, replaceRoute]
  )

  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      target={external ? '_blank' : undefined}
      onClick={onLinkPress}
      data-testid={testID}
      style={isFullHeight ? { flex: 1, display: 'flex' } : { flex: 'auto' }}
      replace={replace}
    >
      {children}
    </Link>
  )
}
