import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { FieldPolicy, Reference } from '@apollo/client/cache'
import { onError } from '@apollo/client/link/error'
import ApolloLinkTimeout from 'apollo-link-timeout'
import { createUploadLink } from 'apollo-upload-client'

import { holiApiUrl } from '@holi/api/config'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'

import headerLink from './headerLink'

// The HOLI backend needs ~35s for a cold boot (which it does on a regular basis as we scale to zero), timeout respects that
const TIMEOUT_IN_MS = 60 * 1000 // 60 seconds

const timeoutLink = new ApolloLinkTimeout(TIMEOUT_IN_MS)
const uploadLink = createUploadLink({ uri: holiApiUrl, credentials: 'include' })
const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log('####### errorLink ...', networkError)

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
// For mobile it is also necessary to explicitly set the Accept-Language header.
// `headerLink` is therefore only needed on Mobile (i.e. when defined)
const link = from([headerLink, timeoutLink, errorLink, uploadLink].filter((link) => !!link))

export const createCache = () =>
  new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          interests: {
            // fixes warning "Cache data may be lost when replacing the `interests` field of a User object."
            merge: (existing, incoming) => incoming,
          },
          skills: {
            // fixes warning "Cache data may be lost when replacing the `skills` field of a User object."
            merge: (existing, incoming) => incoming,
          },
          sdgs: {
            // fixes warning "Cache data may be lost when replacing the `sdgs` field of a User object."
            merge: (existing, incoming) => incoming,
          },
        },
      },
      AppDonations_ProjectsResponse: {
        fields: {
          projects: indexAwareOffsetLimitPagination(),
        },
      },
      Query: {
        fields: {
          // here, we can specify e.g. pagination behavior, depending on the
          // query, see https://www.apollographql.com/docs/react/pagination/overview
          appDonations_projects: {
            keyArgs: ['locale', 'location'],
          },
        },
      },
    },
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyArgs = FieldPolicy<any>['keyArgs']

/**
 * Provides an index-aware pagination function. an index-aware pagination function takes both offset and limit arguments
 * into account, whereas Apollos built-in offsetLimitPagination ignores the limit part. The resulting issue (see also
 * HOLI-2400) is that, given a cached query result of 5 items and a query with the same offset but 10 items, will result
 * in no query being executed to fetch the missing 5 items.
 *
 * The implementation works by "remembering" individual items offsets and assuming a cache miss if any item requested
 * (any item within the range between offset and offset+limit) is not present.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function indexAwareOffsetLimitPagination<T = Reference>(keyArgs?: KeyArgs): FieldPolicy<T[]> {
  return {
    keyArgs,
    merge: (existing, incoming, { variables }) => {
      const offset = variables && variables.offset
      const limit = variables && variables.limit
      if (!existing) {
        // empty cache
        return incoming
      } else if (offset === 0 && incoming.length >= existing.length) {
        // incoming "overwrites" existing
        return incoming
      } else if (existing.length >= offset + limit) {
        // within range of existing -> incoming overwrites at the correct indices
        const prefix = existing.slice(0, offset)
        const suffix = existing.slice(offset + limit)
        return prefix.concat(incoming.concat(suffix))
      } else {
        // existing and incoming are not overlapping -> fill with empty values in between
        const fill = Array(offset - existing.length).fill(null)
        return existing.concat(fill).concat(incoming)
      }
    },
    read: (existing, { variables }) => {
      const offset = variables && variables.offset
      const limit = variables && variables.limit
      if (existing === undefined || existing.length < offset + limit) {
        // cache miss if cache empty or existing contains fewer entries than requested
        return undefined
      } else if (existing.some((e) => e === null)) {
        // cache miss if cache is missing individual items
        return undefined
      } else {
        return existing
      }
    },
  }
}

export const client = new ApolloClient({ link, cache: createCache() })

export default client
