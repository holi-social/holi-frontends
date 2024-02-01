import type { PropsWithChildren } from 'react'
import React from 'react'
import { Pressable } from 'react-native'

import type { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import useLink from '@holi/core/navigation/hooks/useLink'

export const HoliLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  testID = 'link',
}: PropsWithChildren<HoliLinkProps>) => {
  const handleLinkPress = useLink({ href, external, onPress, mobileNavigateBackFirst })

  return (
    <Pressable role="link" aria-label={label} accessible onPress={handleLinkPress} testID={testID}>
      {children}
    </Pressable>
  )
}
