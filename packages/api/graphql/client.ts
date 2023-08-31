import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from '@apollo/client'
import { makeVar, useReactiveVar } from '@apollo/client'
import { offsetLimitPagination } from '@apollo/client/utilities'
import ApolloLinkTimeout from 'apollo-link-timeout'
import { createUploadLink } from 'apollo-upload-client'
import fetch from 'cross-fetch'
import { concat, mergeDeepWith, pick, pipe, uniqBy } from 'ramda'

import { holiApiUrl } from '@holi/api/config'

import { alwaysReplacePolicy, indexAwareOffsetLimitPagination, nestedPaginationPolicy } from './cachePolicies'
import errorLink from './errorLink'
import headerLink from './headerLink'

// The HOLI backend needs ~35s for a cold boot (which it does on a regular basis as we scale to zero), timeout respects that
const TIMEOUT_IN_MS = 60 * 1000 // 60 seconds

const timeoutLink = new ApolloLinkTimeout(TIMEOUT_IN_MS)
const unauthorizedErrorStatusVar = makeVar<boolean>(false)
export const setUnauthorizedErrorStatus = unauthorizedErrorStatusVar
export const useUnauthorizedErrorStatusVar = () => useReactiveVar(unauthorizedErrorStatusVar)

// There might be something fishy here, types dont match and if it is not the last link in the chain, throws the error "You are calling concat on a terminating link"
const uploadLink: ApolloLink = createUploadLink({ uri: holiApiUrl, credentials: 'include' })

export const createCache = () =>
  new InMemoryCache({
    // eslint-disable-next-line prettier/prettier
    typePolicies: {
      User: {
        fields: {
          interests: alwaysReplacePolicy,
          skills: alwaysReplacePolicy,
          sdgs: alwaysReplacePolicy,
        },
      },
      InsightPaged: {
        fields: {
          data: indexAwareOffsetLimitPagination(),
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
            merge: (existing = [], incoming = []) =>
              pipe<unknown[][], unknown[], unknown[]>(concat, uniqBy(pick(['__ref'])))(existing, incoming),
            read: (existing) => existing,
          },
        },
      },
      Space: {
        fields: {
          members: alwaysReplacePolicy,
          tasks: alwaysReplacePolicy,
          sdgs: alwaysReplacePolicy,
          topics: alwaysReplacePolicy,
          links: alwaysReplacePolicy,
          collaborationTools: alwaysReplacePolicy,
          posts: {
            keyArgs: ['idOrName', 'visibility'],
          },
        },
      },
      SpacePaged: {
        fields: {
          data: indexAwareOffsetLimitPagination(),
        },
      },
      SpaceMemberPaged: {
        fields: {
          // Only allow pagination on the space detail screen, recognizable by `idOrName`
          data: nestedPaginationPolicy(['idOrName']),
        },
      },
      UserPaged: {
        fields: {
          // Only allow pagination when searching for users by `substring`
          data: nestedPaginationPolicy(['substring']),
        },
      },
      PostPaged: {
        fields: {
          data: {
            ...indexAwareOffsetLimitPagination(),
            // Use Apollo's default offsetLimitPagination's read method for Posts, since the limit
            // is always the same in this case (no screens asking for different limits for Posts)
            read: offsetLimitPagination().read,
          },
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
          appVolunteering_engagementOpportunities: {
            keyArgs: ['location', 'category'],
          },
          spaces: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            keyArgs: (args: Record<string, any> | null) => {
              // reminder: keep in sync with parameters of `spaces` in `Query`, always exclude offset and limit
              const { topicSlug, geolocation, skillSlugs } = args || {}
              return JSON.stringify({
                topicSlug,
                geolocation: geolocation?.properties?.place_id,
                skillSlugs,
              })
            },
          },
          discoverSpaces: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            keyArgs: (args: Record<string, any> | null) => {
              // reminder: keep in sync with parameters of `discoverSpaces` in `Query`, always exclude offset and limit
              const { topicIds, geolocation, skillIds } = args || {}
              return JSON.stringify({
                topicIds,
                geolocation: geolocation?.properties?.place_id,
                skillIds,
              })
            },
          },
          userByName: {
            keyArgs: ['substring'],
          },
        },
      },
    },
  })

interface ApolloCreateClientOptions {
  readonly ssrMode: boolean
}

const isSSR = typeof window === 'undefined'

const API_URL = process.env.HOLI_API_URL
const httpLink = new HttpLink({ uri: API_URL, fetch })

const cache = createCache()

// Web authentication works using http-only cookies that are transparently added to requests by the Browser
// Mobile authentication works by adding the `X-Session-Token` header which takes its value from `SecureStorage`
// For mobile it is also necessary to explicitly set the Accept-Language header.
// `headerLink` is therefore only needed on Mobile (i.e. when defined)
const link = from([headerLink, timeoutLink, errorLink, uploadLink].filter((link) => !!link))

const createApolloClient = ({ ssrMode }: ApolloCreateClientOptions) => {
  const clientLink = isSSR ? from([errorLink, httpLink]) : link

  return new ApolloClient({ ssrMode, link: clientLink, cache })
}

// Web
/** This `let` variable can only be mutated by the initializeApolloSSRClient function. */
let apolloSSRClient: ApolloClient<NormalizedCacheObject> | null = null

type SSRClientInitState = Record<string, unknown> | null

export const initializeApolloSSRClient = (initState: SSRClientInitState = null) => {
  const client = apolloSSRClient ?? createApolloClient({ ssrMode: isSSR })

  if (initState) {
    const existingCache = client.extract()
    const merge = mergeDeepWith(concat)

    client.cache.restore(merge(existingCache, initState))
  }

  if (isSSR) return client
  if (!apolloSSRClient) apolloSSRClient = client

  return client
}

// Mobile
// TODO: rename to recognize its only for client-side JS
export const client = createApolloClient({ ssrMode: false })

export default client
