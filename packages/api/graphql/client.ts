import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { offsetLimitPagination } from '@apollo/client/utilities'
import ApolloLinkTimeout from 'apollo-link-timeout'
import { createUploadLink } from 'apollo-upload-client'

import { holiApiUrl } from '@holi/api/config'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'

import authLink from './authLink'

// The HOLI backend needs ~35s for a cold boot (which it does on a regular basis as we scale to zero), timeout respects that
const TIMEOUT_IN_MS = 60 * 1000 // 60 seconds

const timeoutLink = new ApolloLinkTimeout(TIMEOUT_IN_MS)
const uploadLink = createUploadLink({ uri: holiApiUrl, credentials: 'include' })
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Do not log "not found" errors
  if (graphQLErrors && isNotFoundError({ graphQLErrors })) {
    return
  }
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
const link = from([authLink, timeoutLink, errorLink, uploadLink].filter((link) => !!link))

export const client = new ApolloClient({
  link,
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
