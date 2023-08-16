import { makeVar, useReactiveVar } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import client from '@holi/api/graphql/client'
import { stopChat } from '@holi/chat/src/client/chatSession'
import { getSessionFromStorage, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import { setUserLoggedOut } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { ensureOAuth2Logout } from '@holi/core/helpers/oauth2'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

interface LogoutOptions {
  message?: string
  skipLogoutFlow?: boolean
  redirectPath?: string
}

const isLoggingOutVar = makeVar(false)

export const useLogout = () => {
  const isLoggingOut = useReactiveVar(isLoggingOutVar)
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  return {
    logout: useCallback(
      async ({ message, skipLogoutFlow = false, redirectPath = '/profile' }: LogoutOptions = {}) => {
        isLoggingOutVar(true)
        await stopChat()

        getSessionFromStorage()
          .then((session) => {
            if (!skipLogoutFlow) {
              return submitLogoutFlow({ session_token: session ? session.session_token : '' })
            }
          })
          .then(() => client.clearStore())
          .then(() => ensureOAuth2Logout())
          .then(() => setUserLoggedOut())
          .then(() => {
            console.debug('[Logout] logout successful')
            openToast(message || t('auth.logout.success'), HoliToastType.SUCCESS)
            navigate(redirectPath)
          })
          .catch((e) => {
            console.debug('[Logout] logout failed, removing session from storage')
            setUserLoggedOut() // will remove session info from storage
            throw e // will be sent to Sentry so we're aware of it
            // not displaying an user-facing error messages as with the removal from the storage logout should be done
          })
          .catch((error) => displayError(error, t('auth.logout.error')))
          .finally(() => isLoggingOutVar(false))
      },
      [navigate, openToast, t, displayError]
    ),
    isLoggingOut,
  }
}
