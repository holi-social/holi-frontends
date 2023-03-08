import Link from 'next/link'
import type { SyntheticEvent } from 'react'
import React, { useCallback } from 'react'
import type { PropsWithChildren } from 'react'

import type { HoliLinkProps } from '@holi/ui/components/atoms/HoliLink'

import styles from './HoliLink.module.scss'

type HoliLinkWeb = Omit<HoliLinkProps, 'mobileNavigateBackFirst'>

const HoliLink = ({
  href,
  label,
  external,
  onPress,
  children,
  testID = 'text-link',
}: PropsWithChildren<HoliLinkWeb>) => {
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
        className={styles.link}
        onClick={onLinkPress}
        data-testid={testID}
      >
        {children}
      </a>
    </Link>
  )
}

export default HoliLink
