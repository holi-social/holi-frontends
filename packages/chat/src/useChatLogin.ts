import { useCallback } from 'react'

import ChatLogin, { SSOAction } from '@holi/chat/src/ChatLogin'
import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { logError } from '@holi/core/errors/helpers'
import useLinking from '@holi/core/navigation/hooks/useLinking'

export interface UseChatLogin {
  deviceName: string
  tokenKey: string
  handleSSORedirect: () => Promise<boolean>
  login: (token: string | undefined) => Promise<boolean>
  getLoginStatus: () => Promise<boolean>
  restoreSessionCredentials: () => Promise<ChatCredentials>
}

const useChatLogin = (): UseChatLogin => {
  const { createUrl, openUrl } = useLinking()
  const callbackUrl = createUrl('/chat')

  const matrixLogin = new ChatLogin(callbackUrl)
  const redirectURL = matrixLogin.getRedirectURL(SSOAction.LOGIN)

  const handleSSORedirect = useCallback(async () => {
    if (redirectURL === null) {
      logError('Unable to retrieve chat server redirect URL')
      return false
    }

    return await openUrl(redirectURL)
  }, [openUrl, redirectURL])

  return {
    handleSSORedirect,
    login: matrixLogin.login,
    deviceName: matrixLogin.deviceName,
    tokenKey: matrixLogin.homeserverTokenKey,
    getLoginStatus: matrixLogin.getLoginStatus,
    restoreSessionCredentials: matrixLogin.restoreSessionCredentials,
  }
}

export default useChatLogin
