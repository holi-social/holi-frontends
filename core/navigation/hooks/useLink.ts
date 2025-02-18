import type React from 'react'
import { useCallback } from 'react'
import { type GestureResponderEvent, Linking, Platform } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'

export interface UseLinkProps {
  href: string
  /** if given, `onPress` will be executed before opening href (if given). if `onPress` returns `false` (synchronously, required for web) event propagation will be stopped */
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
  external?: boolean
  mobileNavigateBackFirst?: boolean
}

const useLink = ({ onPress, external, href, mobileNavigateBackFirst }: UseLinkProps) => {
  const { navigate, navigateBack } = useRouting()

  return useCallback(
    async (event: React.SyntheticEvent | GestureResponderEvent) => {
      if (onPress) {
        // Not awaiting promise before event propagation to mimick web behaviour
        const propagateEventOrPromise = onPress(event)
        if (propagateEventOrPromise === false) return
        await propagateEventOrPromise
      }
      if (external) {
        Linking.openURL(href)
        return
      }

      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // If the platform is mobile and the link domain matches our app's domain, navigate to the route instead of opening the link
        const route = '/' + href.replace(/https:\/\/(app\.holi\.social|staging\.dev\.holi\.social)(\/(en|de))?\/?/, '')
        if (mobileNavigateBackFirst) {
          navigateBack()
          setTimeout(() => navigate(route), 300)
        } else {
          navigate(route)
        }
      } else {
        navigate(href)
      }
    },
    [external, href, mobileNavigateBackFirst, navigate, navigateBack, onPress]
  )
}

export default useLink
