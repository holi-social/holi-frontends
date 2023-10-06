import type { PropsWithChildren } from 'react'
import React from 'react'
import { Pressable } from 'react-native'

import type { UseLinkProps } from '@holi/core/navigation/hooks/useLink'
import useLink from '@holi/core/navigation/hooks/useLink'

export interface HoliLinkProps extends UseLinkProps {
  label: string
  testID?: string
}

const HoliLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  testID = 'text-link',
}: PropsWithChildren<HoliLinkProps>) => {
  const handleLinkPress = useLink({ href, external, onPress, mobileNavigateBackFirst })

  return (
    <Pressable role="link" aria-label={label} accessible onPress={handleLinkPress} testID={testID}>
      {children}
    </Pressable>
  )
}

export default HoliLink
