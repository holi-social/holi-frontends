import type { PropsWithChildren } from 'react'
import React from 'react'
import { GestureResponderEvent, Linking, Pressable } from 'react-native'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'

export interface HoliNavigationLinkProps {
  href: string
  label: string
  external?: boolean
  onPress?: CallableFunction
  mobileNavigateBackFirst?: boolean
  testID?: string
}

const HoliNavigationLink = ({
  href,
  label,
  external,
  onPress,
  children,
  mobileNavigateBackFirst,
  testID = 'text-link',
}: PropsWithChildren<HoliNavigationLinkProps>) => {
  const { navigate, navigateBack } = useUnifiedNavigation()

  const onLinkPress = (event: GestureResponderEvent) => {
    const stopPropagation = onPress?.(event)

    if (stopPropagation === false) return

    if (external) {
      Linking.openURL(href)
      return
    }

    if (mobileNavigateBackFirst) {
      navigateBack()
      setTimeout(() => navigate(href), 300)
    } else {
      navigate(href)
    }
  }

  return (
    <Pressable
      accessibilityRole={'link'}
      accessibilityLabel={label}
      accessible
      onPress={onPress ? onLinkPress : undefined}
      testID={testID}
    >
      {children}
    </Pressable>
  )
}

export default HoliNavigationLink
