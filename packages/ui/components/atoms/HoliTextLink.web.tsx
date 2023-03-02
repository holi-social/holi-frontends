import type { PropsWithChildren } from 'react'
import React from 'react'

import HoliText from '@holi//ui/components/atoms/HoliText'
import HoliNavigationLink from '@holi/ui/components/atoms/HoliNavigationLink'
import type { HoliTextLinkProps } from '@holi/ui/components/atoms/HoliTextLink'

import styles from './HoliTextLink.module.scss'

type HoliTextLinkWeb = Omit<HoliTextLinkProps, 'mobileNavigateBackFirst'>

const HoliLink = ({
  href,
  label,
  external,
  onPress,
  children,
  size = 'default',
  variant = 'primary',
  testID = 'text-link',
}: PropsWithChildren<HoliTextLinkWeb>) => {
  return (
    <HoliNavigationLink external={external} href={href} label={label} onPress={onPress} testID={testID}>
      <HoliText size={size} style={styles[variant]} bold>
        {children}
      </HoliText>
    </HoliNavigationLink>
  )
}

export default HoliLink
