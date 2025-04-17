import * as WebBrowser from 'expo-web-browser'
import React, { useEffect } from 'react'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { View } from 'react-native'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'

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
      displayError(result, 'Failed to complete OIDC auth session', {
        location: 'LoginCallback.maybeCompleteAuthSession',
      })
      navigate('/login')
    }
  }, [displayError, navigate])

  return (
    <View style={{ flex: 1 }}>
      <HoliLoader testID="loader" />
    </View>
  )
}
