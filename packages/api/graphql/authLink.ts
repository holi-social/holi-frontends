import { setContext } from '@apollo/client/link/context'

import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const sessionToken = await getSessionFromStorage().then((s) => s?.session_token)
  const xSessionTokenHeaders = sessionToken
    ? {
        Authorization: 'Bearer ' + sessionToken,
        'X-Session-Token': sessionToken,
      }
    : {}
  // return the headers to the context so authLink can read them
  return {
    headers: {
      ...headers,
      ...xSessionTokenHeaders,
    },
  }
})

export default authLink
