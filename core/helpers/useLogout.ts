import { makeVar, useReactiveVar } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import client from '@holi/api/graphql/client'
import { getSessionFromStorage, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import { setUserLoggedOut, useAuth } from '@holi/core/auth/helpers/useAuth'
import { logDebug } from '@holi/core/helpers/logging'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

interface LogoutOptions {
  message?: string
  skipLogoutFlow?: boolean
  redirectPath?: string
  redirectTimeout?: number
}

const isLoggingOutVar = makeVar(false)
export let isProcessingLogout = false

export const useLogout = () => {
  const { userId } = useAuth()
  const isLoggingOut = useReactiveVar(isLoggingOutVar)
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { openToast } = useToast()

  return {
    logout: useCallback(
      async ({
        message,
        skipLogoutFlow = false,
        redirectPath = '/profile',
        redirectTimeout = undefined,
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

        if (isProcessingLogout || isLoggingOut || userId === null) {
          redirect()
          return
        }
        isProcessingLogout = true
        isLoggingOutVar(true)

        try {
          const session = await getSessionFromStorage()
          if (!skipLogoutFlow) {
            await submitLogoutFlow({ session_token: session?.session_token || '' })
          }
          await client.clearStore()
          await setUserLoggedOut()

          logDebug('useLogout', 'logout successful')
          openToast(message || t('auth.logout.success'), HoliToastType.SUCCESS)
        } catch (err) {
          logDebug('useLogout', 'logout failed, removing session from storage', err)
          setUserLoggedOut() // will remove session info from storage
          throw err // will be sent to Sentry so we're aware of it
          // not displaying any user-facing error messages as with the removal from the storage logout should be done
        } finally {
          isLoggingOutVar(false)
          isProcessingLogout = false
          redirect()
        }
      },
      [navigate, openToast, t, isLoggingOut, userId]
    ),
    isLoggingOut,
  }
}
