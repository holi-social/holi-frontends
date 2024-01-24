import type { PropsWithChildren } from 'react'
import React from 'react'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink.shared'
import HoliText, { HoliTextProps } from '@holi/ui/components/atoms/HoliText'

export type HoliTextLinkProps = HoliLinkProps & Pick<HoliTextProps, 'color' | 'size'>

export const HoliTextLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  testID = 'text-link',
  color,
  size,
}: PropsWithChildren<HoliTextLinkProps>) => {
  return (
    <HoliLink
      href={href}
      label={label}
      external={external}
      onPress={onPress}
      mobileNavigateBackFirst={mobileNavigateBackFirst}
      testID={testID}
    >
      <HoliText size={size} color={color} bold>
        {children}
      </HoliText>
    </HoliLink>
  )
}
