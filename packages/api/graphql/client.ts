import { ApolloClient, InMemoryCache } from '@apollo/client'

import { holiApiUrl } from '@holi/api/config'

import link from './link'

export const client = new ApolloClient({
  uri: holiApiUrl,
  credentials: 'include',
  // default behavior on web (sending Ory session cookies), on mobile we add 'X-Session-Token' header for authentication
  link: link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // here, we can specify e.g. pagination behavior, depending on the
          // query, see https://www.apollographql.com/docs/react/pagination/overview
        },
      },
    },
  }),
})

export default client
