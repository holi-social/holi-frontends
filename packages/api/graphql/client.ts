import { ApolloClient, InMemoryCache } from '@apollo/client'
import { offsetLimitPagination } from '@apollo/client/utilities'

import { apiHost } from '@holi/api/config'

export const client = new ApolloClient({
  uri: `http://${apiHost}:4001/graphql`,
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
