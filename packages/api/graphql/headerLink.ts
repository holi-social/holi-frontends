import { setContext } from '@apollo/client/link/context'

import { createAuthorizationHeaders } from '@holi/api/helpers'
import i18n from '@holi/core/i18n'

const headerLink = setContext(async (_, { headers }) => {
  const authorizationHeaders = await createAuthorizationHeaders()
  // return the headers to the context so headerLink can read them
  return {
    headers: {
      ...headers,
      ...authorizationHeaders,
      'Accept-Language': [i18n.language, 'en'].join(','),
    },
  }
})

export default headerLink
