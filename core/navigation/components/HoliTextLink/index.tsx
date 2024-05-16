import type { PropsWithChildren } from 'react'
import React from 'react'

import { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'
import useLink from '@holi/core/navigation/hooks/useLink'
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
  size,
  align,
}: PropsWithChildren<HoliTextLinkProps>) => {
  const handleLinkPress = useLink({ href, external, onPress, mobileNavigateBackFirst })

  return (
    <HoliText
      role="link"
      aria-label={label}
      onPress={handleLinkPress}
      size={size}
      color={color}
      align={align}
      bold
      testID={testID}
    >
      {children}
    </HoliText>
  )
}
