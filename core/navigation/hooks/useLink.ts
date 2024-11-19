import React, { useCallback } from 'react'
import { GestureResponderEvent, Linking, Platform } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'

export interface UseLinkProps {
  href: string
  /** if given, `onPress` will be executed before opening href (if given). if `onPress` returns `false` event propagation will be stopped */
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
  external?: boolean
  mobileNavigateBackFirst?: boolean
}

const useLink = ({ onPress, external, href, mobileNavigateBackFirst }: UseLinkProps) => {
  const { navigate, navigateBack } = useRouting()

  return useCallback(
    async (event: React.SyntheticEvent | GestureResponderEvent) => {
      if (onPress) {
        const stopPropagation = await onPress(event)
        if (stopPropagation === false) return
      }
      if (external) {
        Linking.openURL(href)
        return
      }

      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // If the platform is mobile and the link domain matches our app's domain, navigate to the route instead of opening the link
        const route = '/' + href.replace(/https:\/\/(app\.holi\.social|staging\.dev\.holi\.social)(\/(en|de))?\/?/, '')
        navigate(route)
      } else if (mobileNavigateBackFirst) {
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
