import { ApolloClient, InMemoryCache } from '@apollo/client'
import { offsetLimitPagination } from '@apollo/client/utilities'

import { holiApiUrl } from '@holi/api/config'

console.info('sentry init', process.env)
console.info('api url: ', holiApiUrl)

export const client = new ApolloClient({
  uri: holiApiUrl,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allPosts: offsetLimitPagination(),
          allUsers: offsetLimitPagination(),
        },
      },
    },
  }),
})

export default client
