import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import client from '@holi/api/graphql/client'
import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { getSessionFromStorage, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export const useLogout = () => {
  const { setUserLoggedOut } = useAuth()
  const { navigate } = useUnifiedNavigation()
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  return useCallback(
    ({ message, skipLogoutFlow = false }: { message?: string; skipLogoutFlow?: boolean } = {}) => {
      getSessionFromStorage()
        .then((session) => {
          if (!skipLogoutFlow) {
            return submitLogoutFlow({ session_token: session ? session.session_token : '' })
          }
        })
        .then(() => client.clearStore())
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
    },
    [navigate, openToast, setUserLoggedOut, t, displayError]
  )
}
