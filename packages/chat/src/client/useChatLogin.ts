import ChatLogin from '@holi/chat/src/client/ChatLogin'

export interface UseChatLogin {
  chatLoginClient: ChatLogin
}

/**
 * @description the client returned from this hook is disposable and only
 * necessary for login.
 */
const useChatLogin = (): UseChatLogin => {
  const chatLoginClient = new ChatLogin()

  return {
    chatLoginClient,
  }
}

export default useChatLogin
