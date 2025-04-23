import * as WebBrowser from 'expo-web-browser'
import React, { useEffect } from 'react'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { View } from 'react-native'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'

const LOGIN_REDIRECT_TIMEOUT = 2000

export type LoginCallbackParams = {
  code: string
}

// Only used on android
export const LoginCallback = () => {
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()

  useEffect(() => {
    // Completes sign in with OIDC account
    const result = WebBrowser.maybeCompleteAuthSession({
      skipRedirectCheck: false,
    })
    if (result.type !== 'success') {
      const timer = setTimeout(() => {
        // Display error and navigate to login if login failed
        // Awaiting a timeout first, as on android the result might be "failed" in case of success as well..
        displayError(result, 'Failed to complete OIDC auth session', {
          location: 'LoginCallback.maybeCompleteAuthSession',
        })
        navigate('/login')
      }, LOGIN_REDIRECT_TIMEOUT)
      return () => clearTimeout(timer)
    }
  }, [displayError, navigate])

  return (
    <View style={{ flex: 1 }}>
      <HoliLoader testID="loader" />
    </View>
  )
}
