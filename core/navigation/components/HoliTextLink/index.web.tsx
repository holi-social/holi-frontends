import { TextLink } from 'holi-bricks/components/text'
import type { PropsWithChildren } from 'react'
import React from 'react'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'

export const HoliTextLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  color,
  textAlign,
  size,
}: PropsWithChildren<HoliTextLinkProps>) => {
  return (
    <TextLink size={size} color={color} textAlign={textAlign}>
      <HoliLink
        href={href}
        label={label}
        external={external}
        onPress={onPress}
        mobileNavigateBackFirst={mobileNavigateBackFirst}
      >
        {children}
      </HoliLink>
    </TextLink>
  )
}
