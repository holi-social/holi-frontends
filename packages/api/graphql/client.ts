import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import ApolloLinkTimeout from 'apollo-link-timeout'
import { createUploadLink } from 'apollo-upload-client'

import { holiApiUrl } from '@holi/api/config'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'

import { indexAwareOffsetLimitPagination } from './cachePolicies'
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
      PagedInsightList: {
        fields: {
          data: {
            merge: (existing, incoming) => (existing || []).concat(incoming),
            read: (existing) => existing,
          },
        },
      },
      AppDonations_ProjectsResponse: {
        fields: {
          data: indexAwareOffsetLimitPagination(),
        },
      },
      AppVolunteering_EngagementsResponse: {
        fields: {
          data: indexAwareOffsetLimitPagination(),
        },
      },
      AppGoodNews_GoodNewsArticlesQueryResponse: {
        fields: {
          articles: {
            merge: (existing, incoming) => (existing || []).concat(incoming),
            read: (existing) => existing,
          },
        },
      },
      PagedSpaceList: {
        fields: {
          data: indexAwareOffsetLimitPagination(),
        },
      },
      Query: {
        fields: {
          // here, we can specify e.g. pagination behavior, depending on the
          // query, see https://www.apollographql.com/docs/react/pagination/overview
          lastInsights: {
            keyArgs: [],
          },
          appDonations_projects: {
            keyArgs: ['location'],
          },
          appGoodNews_articles: {
            keyArgs: [],
          },
          appVolunteering_engagements: {
            keyArgs: ['location', 'category'],
          },
          spaces: {
            keyArgs: ['topicId', 'location', 'skillIds'],
          },
          discoverSpaces: {
            keyArgs: ['topicIds', 'location', 'skillIds'],
          },
        },
      },
    },
  })

interface ApolloCreateClientOptions {
  readonly ssrMode: boolean
}

const createApolloClient = ({ ssrMode }: ApolloCreateClientOptions) => {
  return new ApolloClient({ ssrMode, link, cache: createCache() })
}

// Web
/** This `let` variable can only be mutated by the initializeApolloWebClient function. */
let apolloWebClient: ApolloClient<NormalizedCacheObject> | null = null

// TODO: include documentation comment
export const initializeApolloWebClient = (initState = null) => {
  const client = apolloWebClient ?? createApolloClient({ ssrMode: typeof window === 'undefined' })

  if (initState) {
    // TODO: merge state and cache props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = client.extract()
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return client
  // Create the Apollo Client once in the client
  if (!client) apolloWebClient = client

  return client
}

// Mobile
// TODO: rename to recognize its only for client-side JS
export const client = createApolloClient({ ssrMode: false })

export default client
