import { setContext } from '@apollo/client/link/context'

import { getSessionFromStorage } from '@holi/core/auth/helpers/auth'
import i18n from '@holi/core/i18n'

const headerLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const sessionToken = await getSessionFromStorage().then((s) => s?.session_token)
  const xSessionTokenHeaders = sessionToken
    ? {
        Authorization: 'Bearer ' + sessionToken,
        'X-Session-Token': sessionToken,
      }
    : {}
  // return the headers to the context so headerLink can read them
  return {
    headers: {
      ...headers,
      ...xSessionTokenHeaders,
      'Accept-Language': [i18n.language, 'en'].join(','),
    },
  }
})

export default headerLink
