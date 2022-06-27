import { ApolloClient, HttpLink, InMemoryCache, concat } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { offsetLimitPagination } from '@apollo/client/utilities'
import ApolloLinkTimeout from 'apollo-link-timeout'

import { holiApiUrl } from '@holi/api/config'
import useErrorHandling from '@holi/core/errors/useErrorHandling'

const TIMEOUT_IN_MS = 10000 // 10 second timeout

const { logError } = useErrorHandling()

const timeoutLink = new ApolloLinkTimeout(TIMEOUT_IN_MS)
const httpLink = new HttpLink({ uri: holiApiUrl })
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      const errorMessage = `Message: ${message}, Location: ${locations}, Path: ${path}`
      logError(new Error(errorMessage), '[GraphQL Error]')
    })
  }
  if (networkError) {
    logError(networkError, '[Network error]')
  }
})

export const client = new ApolloClient({
  link: timeoutLink.concat(errorLink.concat(httpLink)),
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
