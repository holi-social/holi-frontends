import Link from 'next/link'
import React, { SyntheticEvent } from 'react'
import type { PropsWithChildren } from 'react'

import type { HoliNavigationLinkProps } from '@holi/ui/components/atoms/HoliNavigationLink'

import styles from './HoliLink.module.scss'

type HoliNavigationLinkWeb = Omit<HoliNavigationLinkProps, 'mobileNavigateBackFirst'>

const HoliNavigationLink = ({
  href,
  label,
  external,
  onPress,
  children,
  testID = 'text-link',
}: PropsWithChildren<HoliNavigationLinkWeb>) => {
  const onLinkPress = (event: SyntheticEvent<HTMLAnchorElement, Event>) => {
    const stopPropagation = onPress?.(event)
    if (stopPropagation === false) {
      event?.preventDefault()
      event?.stopPropagation()
      return false
    }
  }

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

export default HoliNavigationLink
