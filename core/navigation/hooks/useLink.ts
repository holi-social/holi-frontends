import { useCallback } from 'react'
import { GestureResponderEvent, Linking } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'

export interface UseLinkProps {
  href: string
  external?: boolean
  onPress?: CallableFunction
  mobileNavigateBackFirst?: boolean
}

const useLink = ({ onPress, external, href, mobileNavigateBackFirst }: UseLinkProps) => {
  const { navigate, navigateBack } = useRouting()

  return useCallback(
    async (event: GestureResponderEvent) => {
      const stopPropagation = await onPress?.(event)

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
}

export default useLink
