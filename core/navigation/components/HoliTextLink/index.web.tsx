import type { PropsWithChildren } from 'react'
import React from 'react'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'
import HoliText from '@holi/ui/components/atoms/HoliText'

export const HoliTextLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  testID = 'text-link',
  color,
  align,
  size,
}: PropsWithChildren<HoliTextLinkProps>) => {
  return (
    <HoliText size={size} color={color} align={align} bold>
      <HoliLink
        href={href}
        label={label}
        external={external}
        onPress={onPress}
        mobileNavigateBackFirst={mobileNavigateBackFirst}
        testID={testID}
      >
        {children}
      </HoliLink>
    </HoliText>
  )
}
