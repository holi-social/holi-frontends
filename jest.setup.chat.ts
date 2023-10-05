// skip logging matrix client internal stuff
// remove the next line while you are working on tests
console.debug = jest.fn()

export const CHAT_SERVER_NAME = 'test.chat'
export const CHAT_SERVER_URL = 'http://test.chat'

const mockOrySessionInStorage: Record<string, string> | undefined = {
  session_token: 'session_token_stub',
}

jest.mock('@holi/core/helpers/config', () => ({
  chatServerName: CHAT_SERVER_NAME,
  chatServerUrl: CHAT_SERVER_URL,
  chatServerLoginUrl: CHAT_SERVER_URL,
  chatPushGatewayUrl: 'some.push.gateway.url',
}))

jest.mock('@holi/core/auth/helpers/auth', () => ({
  getSessionFromStorage: () => {
    return Promise.resolve(mockOrySessionInStorage)
  },
}))

jest.mock('@holi/core/auth/helpers/auth', () => ({
  getSessionFromStorage: () => {
    return Promise.resolve(mockOrySessionInStorage)
  },
}))

jest.mock('cross-fetch', () => (url: string) => {
  if (`${CHAT_SERVER_URL}/_matrix/client/r0/login` === url) {
    const mockMatrixResponse = {
      user_id: '@someUserIdentity:test.chat',
      access_token: 'syt_Z3JlZ29yMA_someAccessToken',
      home_server: CHAT_SERVER_URL,
      device_id: 'NGRTsomeDeviceId',
    }
    return Promise.resolve(new Response(JSON.stringify(mockMatrixResponse)))
  }
  throw new Error("cross-fetch mock didn't handle a call for: " + url)
})
