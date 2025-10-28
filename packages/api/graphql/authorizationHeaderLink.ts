import { SetContextLink } from '@apollo/client/link/context'

import { createAuthorizationHeaders } from '@holi/api/helpers'

const authorizationHeaderLink = new SetContextLink(async ({ headers }) => {
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
