import { makeVar, useApolloClient, useReactiveVar } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { getSessionFromStorage, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import { setLoginStateLoggedOut, useLoginState } from '@holi/core/auth/loginState'
import { getLogger } from '@holi/core/helpers/logging'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

const logger = getLogger('Auth')

interface LogoutOptions {
  message?: string
  skipLogoutFlow?: boolean
  skipRedirect?: boolean
  redirectPath?: string
  redirectTimeout?: number
  showToastAfter?: boolean
}

const isLoggingOutVar = makeVar(false)
export let isProcessingLogout = false

export const useLogout = () => {
  const loginState = useLoginState()
  const isLoggingOut = useReactiveVar(isLoggingOutVar)
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { openToast } = useToast()
  const client = useApolloClient()

  return {
    logout: useCallback(
      async ({
        message,
        skipLogoutFlow = false,
        skipRedirect = false,
        redirectPath = '/profile',
        redirectTimeout = undefined,
        showToastAfter = true,
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

        if (isProcessingLogout || isLoggingOut || loginState.isLoggedOut) {
          !skipRedirect && redirect()
          return
        }
        isProcessingLogout = true
        isLoggingOutVar(true)

        try {
          if (!skipLogoutFlow) {
            const session = await getSessionFromStorage()
            await submitLogoutFlow({ session_token: session?.session_token || '' })
          }
          await Promise.all([setLoginStateLoggedOut(), storeOnboardingState('finished')])
          await client.clearStore()

          logger.debug('useLogout', 'logout successful')
          if (showToastAfter)
            openToast(message || t('auth.logout.success'), HoliToastType.SUCCESS, { testID: 'logout-success' })
        } catch (err) {
          logger.debug('useLogout', 'logout failed, removing session from storage', err)
          try {
            await Promise.all([setLoginStateLoggedOut(), storeOnboardingState('finished')])
          } catch (e) {
            logger.debug('useLogout', 'cleaning up after logout error failed as well', e)
            openToast(message || t('auth.logout.error'), HoliToastType.ERROR, { testID: 'logout-failed' })
          }
          throw err // will be sent to Sentry so we're aware of it
          // not displaying any user-facing error messages as with the removal from the storage logout should be done
        } finally {
          isLoggingOutVar(false)
          isProcessingLogout = false
          !skipRedirect && redirect()
        }
      },
      [isLoggingOut, loginState, navigate, client, openToast, t]
    ),
    isLoggingOut,
  }
}
