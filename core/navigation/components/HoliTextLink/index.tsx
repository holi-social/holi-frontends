import { TextLink } from 'holi-bricks/components/text'
import type { PropsWithChildren } from 'react'
import React from 'react'

import type { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'
import useLink from '@holi/core/navigation/hooks/useLink'

export const HoliTextLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  color,
  size,
  textAlign,
}: PropsWithChildren<HoliTextLinkProps>) => {
  const handleLinkPress = useLink({ href, external, onPress, mobileNavigateBackFirst })

  return (
    <TextLink size={size} color={color} textAlign={textAlign} onPress={handleLinkPress} aria-label={label}>
      {children}
    </TextLink>
  )
}
