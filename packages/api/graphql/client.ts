import { ApolloClient, InMemoryCache } from '@apollo/client'
import { offsetLimitPagination } from '@apollo/client/utilities'

import { holiApi } from '@holi/api/config'

export const client = new ApolloClient({
  uri: holiApi,
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
