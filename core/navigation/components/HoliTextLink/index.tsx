import { TextLink } from 'holi-bricks/components/text'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { Pressable } from 'react-native'

import { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'
import useLink from '@holi/core/navigation/hooks/useLink'

export const HoliTextLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  testID = 'text-link',
  variant,
  size,
  textAlign,
}: PropsWithChildren<HoliTextLinkProps>) => {
  const handleLinkPress = useLink({ href, external, onPress, mobileNavigateBackFirst })

  return (
    // TODO(SF) combine to one?
    <Pressable onPress={handleLinkPress} testID={testID} aria-label={label}>
      <TextLink size={size} variant={variant} textAlign={textAlign}>
        {children}
      </TextLink>
    </Pressable>
  )
}
