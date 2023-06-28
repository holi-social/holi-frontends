import { useCallback } from 'react'

import ChatLogin, { SSOAction } from '@holi/chat/src/client/ChatLogin'
import { logError } from '@holi/core/errors/helpers'
import useLinking from '@holi/core/navigation/hooks/useLinking'

export interface UseChatLogin {
  temporaryLoginClient: ChatLogin
  handleSSORedirect: () => Promise<boolean>
}

/**
 * @description the client returned from this hook is disposable and only
 * necessary for login.
 */
const useChatLogin = (): UseChatLogin => {
  const { createUrl, openUrl } = useLinking()
  const callbackUrl = createUrl('/chat')

  const chatLoginClient = new ChatLogin(callbackUrl)
  const redirectURL = chatLoginClient.getRedirectURL(SSOAction.LOGIN)

  const handleSSORedirect = useCallback(async () => {
    if (redirectURL === null) {
      logError('Unable to retrieve chat server redirect URL')
      return false
    }

    return await openUrl(redirectURL)
  }, [openUrl, redirectURL])

  return {
    handleSSORedirect,
    temporaryLoginClient: chatLoginClient,
  }
}

export default useChatLogin
