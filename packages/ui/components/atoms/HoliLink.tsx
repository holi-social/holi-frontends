import { PropsWithChildren, useCallback } from 'react'
import React from 'react'
import { GestureResponderEvent, Linking, Pressable } from 'react-native'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'

export interface HoliLinkProps {
  href: string
  label: string
  external?: boolean
  onPress?: CallableFunction
  /** Use this prop in Modal Screens to first close the modal and then navigate */
  mobileNavigateBackFirst?: boolean
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
  const { navigate, navigateBack } = useUnifiedNavigation()

  const onLinkPress = useCallback(
    (event: GestureResponderEvent) => {
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
    },
    [external, href, mobileNavigateBackFirst, navigate, navigateBack, onPress]
  )

  return (
    <Pressable accessibilityRole={'link'} accessibilityLabel={label} accessible onPress={onLinkPress} testID={testID}>
      {children}
    </Pressable>
  )
}

export default HoliLink
