import * as WebBrowser from 'expo-web-browser'
import React, { useEffect } from 'react'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { Platform, View } from 'react-native'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginState } from '@holi/core/auth/loginState'

const LOGIN_REDIRECT_TIMEOUT = 2000

// It's realtively unclear, what is really needed here.
// WebBrowser.maybeCompleteAuthSession is not available on iOS and Android and always returns failure with an unsupported platform error.
// So it's only called in the web version.
// On Android and iOS we wait for the user to be logged in. If this does not happen withing 20 seconds, we display an error and navigate to login.
export const LoginCallback = () => {
  const loginState = useLoginState()
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()

  useEffect(() => {
    if (Platform.OS === 'web') {
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
    } else {
      // Polling to wait until the user is logged in, or timeout after 20 seconds.
      const intervalId = setInterval(() => {
        // If logged in, navigate to the home screen and clear timers.
        if (loginState?.isLoggedIn) {
          clearTimeout(timeoutId)
          clearInterval(intervalId)
          navigate('/')
        }
      }, 200)

      const timeoutId = setTimeout(() => {
        // If not logged in after 20 seconds, display error and navigate to login.
        clearInterval(intervalId)
        displayError(null, 'Timed out waiting for login', {
          location: 'LoginCallback.timeout',
        })
        navigate('/login')
      }, 20000)

      return () => {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
      }
    }
  }, [displayError, navigate, loginState?.isLoggedIn])

  return (
    <View style={{ flex: 1 }}>
      <HoliLoader testID="loader" />
    </View>
  )
}
