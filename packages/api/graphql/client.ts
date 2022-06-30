import { ApolloClient, HttpLink, InMemoryCache, concat } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import ApolloLinkTimeout from 'apollo-link-timeout'

import { holiApiUrl } from '@holi/api/config'
import useErrorHandling from '@holi/core/errors/useErrorHandling'

import authLink from './authLink'

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

// Web authentication works using http-only cookies that are transparently added to requests by the Browser
// Mobile authentication works by adding the `X-Session-Token` header which takes its value from `SecureStorage`
// `authLink` is therefore only needed on Mobile (i.e. when defined)
const link = authLink
  ? authLink.concat(timeoutLink.concat(errorLink.concat(httpLink)))
  : timeoutLink.concat(errorLink.concat(httpLink))

export const client = new ApolloClient({
  link,
  credentials: 'include',
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
