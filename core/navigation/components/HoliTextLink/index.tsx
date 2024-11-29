import { TextLink } from 'holi-bricks/components/text'
import type { PropsWithChildren } from 'react'
import React from 'react'

import { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'
import useLink from '@holi/core/navigation/hooks/useLink'

export const HoliTextLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  variant,
  size,
  textAlign,
}: PropsWithChildren<HoliTextLinkProps>) => {
  const handleLinkPress = useLink({ href, external, onPress, mobileNavigateBackFirst })

  return (
    <TextLink
      size={size}
      variant={variant}
      textAlign={textAlign}
      onPress={handleLinkPress}
      aria-label={label}
      role="link"
    >
      {children}
    </TextLink>
  )
}
