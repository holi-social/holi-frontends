import { useCallback } from 'react'
import { GestureResponderEvent, Linking, Platform } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'

export interface UseLinkProps {
  href?: string
  /** if given, `onPress` will be executed before opening href (if given). if `onPress` returns `false` event propagation will be stopped */
  onPress?: CallableFunction
  external?: boolean
  mobileNavigateBackFirst?: boolean
}

const useLink = ({ onPress, external, href, mobileNavigateBackFirst }: UseLinkProps) => {
  const { navigate, navigateBack } = useRouting()

  // Check if href starts with 'www.' and prepend 'http://' if it does
  const adjustedHref = href && href.startsWith('www.') ? 'http://' + href : href

  return useCallback(
    async (event: GestureResponderEvent) => {
      if (onPress) {
        const stopPropagation = await onPress(event)
        if (stopPropagation === false) return
      }
      if (adjustedHref) {
        if (external) {
          Linking.openURL(adjustedHref)
          return
        }

        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          // If the platform is mobile and the link domain matches our app's domain, navigate to the route instead of opening the link
          const route = adjustedHref.replace(/https:\/\/(app\.holi\.social|staging\.dev\.holi\.social)/, '')
          navigate(route)
        } else if (mobileNavigateBackFirst) {
          navigateBack()
          setTimeout(() => navigate(adjustedHref), 300)
        } else {
          navigate(adjustedHref)
        }
      }
    },
    [external, adjustedHref, mobileNavigateBackFirst, navigate, navigateBack, onPress]
  )
}

export default useLink
