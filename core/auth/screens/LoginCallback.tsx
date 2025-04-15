import * as WebBrowser from 'expo-web-browser'
import React, { useEffect } from 'react'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

export type LoginCallbackParams = {
  code: string
}

// Only used on mobile
export const LoginCallback = () => {
  // Completes sign in with OIDC account
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession({
      skipRedirectCheck: false,
    })
  }, [])

  return <HoliLoader testID="loader" />
}
