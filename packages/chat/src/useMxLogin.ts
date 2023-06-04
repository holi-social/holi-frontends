import Constants from 'expo-constants'
import { useCallback } from 'react'
import { Platform } from 'react-native'

import Login, { SSOAction } from '@holi/chat/src/Login'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useLinking from '@holi/core/navigation/hooks/useLinking'

const isWeb = Platform.OS === 'web'
const HOMESERVER_URL = isWeb
  ? process.env.NEXT_PUBLIC_MX_HS_URL ?? 'https://local.chat.holi.social/'
  : Constants.manifest?.extra?.chat.homeserverUrl

export interface UseMXLogin {
  handleSSORedirect: () => Promise<void>
}

const useMxLogin = (): UseMXLogin => {
  const { createUrl, openUrl } = useLinking()
  const { displayError } = useErrorHandling()
  const callbackUrl = createUrl('/chat')

  const mxLogin = new Login(HOMESERVER_URL, callbackUrl)
  const redirectURL = mxLogin.getRedirectURL(SSOAction.LOGIN)
  mxLogin.clearTemporaryClient()

  const handleSSORedirect = useCallback(async () => {
    if (redirectURL === null) {
      displayError('Unable to retrieve redirect URL')
      return
    }

    await openUrl(redirectURL)
  }, [displayError, openUrl, redirectURL])

  return { handleSSORedirect }
}

export default useMxLogin
