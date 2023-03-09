import { useCallback } from 'react'
import { GestureResponderEvent, Linking } from 'react-native'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'

export interface UseLinkProps {
  href: string
  external?: boolean
  onPress?: CallableFunction
  mobileNavigateBackFirst?: boolean
}

const useLink = ({ onPress, external, href, mobileNavigateBackFirst }: UseLinkProps) => {
  const { navigate, navigateBack } = useUnifiedNavigation()

  const handleLinkPress = useCallback(
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

  return handleLinkPress
}

export default useLink
