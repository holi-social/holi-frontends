import { makeVar, useApolloClient, useReactiveVar } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { getSessionFromStorage, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import { setLoginStateLoggedOut } from '@holi/core/auth/loginState'
import { getLogger } from '@holi/core/helpers/logging'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { clearOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { Platform } from 'react-native'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

const logger = getLogger('Auth')

interface LogoutOptions {
  message?: string
  skipLogoutFlow?: boolean
  skipRedirect?: boolean
  redirectPath?: string
  redirectTimeout?: number
  skipToast?: boolean
}

// Exported for testing
export const isLoggingOutVar = makeVar(false)

export const useLogout = () => {
  const { isLoggedOut, user } = useLoggedInUser()
  const isLoggingOut = useReactiveVar(isLoggingOutVar)
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { openToast } = useToast()
  const client = useApolloClient()

  const logout = useCallback(
    async ({
      message,
      skipLogoutFlow = false,
      skipRedirect = false,
      redirectPath = '/profile',
      redirectTimeout = Platform.OS !== 'web' ? 200 : undefined,
      skipToast = false,
    }: LogoutOptions = {}) => {
      const redirect = () => {
        if (redirectTimeout) {
          setTimeout(() => {
            navigate(redirectPath)
          }, redirectTimeout)
        } else {
          navigate(redirectPath)
        }
      }

      if (isLoggingOut || isLoggedOut) {
        if (!skipRedirect) {
          redirect()
        }
        return
      }
      isLoggingOutVar(true)

      try {
        if (!skipLogoutFlow) {
          const session = await getSessionFromStorage()
          await submitLogoutFlow({ sessionToken: session?.session_token, accountType: user?.accountType })
        }
        clearOnboardingState()
        await setLoginStateLoggedOut()
        await client.clearStore()

        logger.debug('useLogout', 'logout successful')
        if (!skipToast)
          openToast(message || t('auth.logout.success'), HoliToastType.SUCCESS, { testID: 'logout-success' })
      } catch (err) {
        logger.debug('useLogout', 'logout failed, removing session from storage', err)
        try {
          clearOnboardingState()
          await setLoginStateLoggedOut()
        } catch (e) {
          logger.debug('useLogout', 'cleaning up after logout error failed as well', e)
          openToast(message || t('auth.logout.error'), HoliToastType.ERROR, { testID: 'logout-failed' })
        }
        throw err // will be sent to Sentry so we're aware of it
        // not displaying any user-facing error messages as with the removal from the storage logout should be done
      } finally {
        isLoggingOutVar(false)
        if (!skipRedirect) {
          redirect()
        }
      }
    },
    [isLoggingOut, isLoggedOut, navigate, client, openToast, t, user?.accountType]
  )

  return {
    logout,
    isLoggingOut,
  }
}
