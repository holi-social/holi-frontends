import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import client from '@holi/api/graphql/client'
import { getSessionFromStorage, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import { setUserLoggedOut } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { clearWebviewCookies } from '@holi/core/helpers/webview'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  return {
    logout: useCallback(
      async ({ message, skipLogoutFlow = false }: { message?: string; skipLogoutFlow?: boolean } = {}) => {
        setIsLoggingOut(true)

        getSessionFromStorage()
          .then((session) => {
            if (!skipLogoutFlow) {
              return submitLogoutFlow({ session_token: session ? session.session_token : '' })
            }
          })
          .then(() => client.clearStore())
          .then(() => clearWebviewCookies())
          .then(() => setUserLoggedOut())
          .then(() => {
            console.info('[Logout] logout successful')
            navigate('/profile')
            openToast(message || t('auth.logout.success'), HoliToastType.SUCCESS)
          })
          .catch((e) => {
            console.warn('[Logout] logout failed, removing session from storage')
            setUserLoggedOut() // will remove session info from storage
            throw e // will be sent to Sentry so we're aware of it
            // not displaying an user-facing error messages as with the removal from the storage logout should be done
          })
          .catch((error) => displayError(error, t('auth.logout.error')))
          .finally(() => setIsLoggingOut(false))
      },
      [navigate, openToast, t, displayError]
    ),
    isLoggingOut,
  }
}
