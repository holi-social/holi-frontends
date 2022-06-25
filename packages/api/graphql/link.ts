import { holiApiUrl } from '@holi/api/config'
import { getAuthenticatedSession } from '@holi/core/auth/helpers/auth'
import { setContext } from '@apollo/client/link/context'
import { createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
  uri: holiApiUrl,
})

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const sessionToken = await getAuthenticatedSession().then((s) => s?.session_token)
  const xSessionTokenHeaders = sessionToken ? { 'X-Session-Token': sessionToken } : {}
  // return the headers to the context so link can read them
  return {
    headers: {
      ...headers,
      ...xSessionTokenHeaders,
    },
  }
})

const link = authLink.concat(httpLink)

export default link