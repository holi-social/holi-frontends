import type React from 'react'
import { useCallback } from 'react'
import { type GestureResponderEvent, Linking } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'

export interface UseLinkProps {
  href: string
  /** if given, `onPress` will be executed before opening href (if given). if `onPress` returns `false` (synchronously, required for web) event propagation will be stopped */
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
  external?: boolean
}

// This hook is for mobile only and is used inside HoliLink and HoliTextLink, which have alternative implementations for web.
const useLink = ({ onPress, external, href }: UseLinkProps) => {
  const { navigate } = useRouting()

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

      let route

      // If the platform is mobile and the link domain matches our app's domain, navigate to the route instead of opening the link
      const isChallengeUrl = /https:\/\/(challenges\.holi\.social|staging\.challenges-dev\.holi\.social)/.test(href)

      if (isChallengeUrl) {
        // For challenge URLs, route to /apps/challenges with the full path as a query param
        const challengePath = href
          .replace(/https:\/\/(challenges\.holi\.social|staging\.challenges-dev\.holi\.social)\/?/, '')
          .replace(/\?referrerPath=.*$/, '')
        route = `//apps/challenges?path=${encodeURIComponent(challengePath)}`
      } else {
        route = '/' + href.replace(/https:\/\/(app\.holi\.social|staging\.dev\.holi\.social)(\/(en|de))?\/?/, '')
      }
      navigate(route)
    },
    [external, href, navigate, onPress]
  )
}

export default useLink
