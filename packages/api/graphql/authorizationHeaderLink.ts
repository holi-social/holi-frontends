import { setContext } from '@apollo/client/link/context'

import { createAuthorizationHeaders } from '@holi/api/helpers'

const authorizationHeaderLink = setContext(async (_, { headers }) => {
  const authorizationHeaders = await createAuthorizationHeaders()
  // return the headers to the context so headerLink can read them
  return {
    headers: {
      ...headers,
      ...authorizationHeaders,
    },
  }
})

export default authorizationHeaderLink
