import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from '@apollo/client'
import ApolloLinkTimeout from 'apollo-link-timeout'
import { createUploadLink } from 'apollo-upload-client'
import crossFetch from 'cross-fetch'
import { concat, mergeDeepLeft, pick, pipe, uniqBy } from 'ramda'

import { holiApiUrl } from '@holi/api/config'
import { isSSR } from '@holi/core/helpers/isSSR'

import { alwaysReplacePolicy, pagedPolicy } from './cachePolicies'
import errorLink from './errorLink'
import headerLink from './headerLink'

// The HOLI backend needs ~35s for a cold boot (which it does on a regular basis as we scale to zero), timeout respects that
const TIMEOUT_IN_MS = 60 * 1000 // 60 seconds

const timeoutLink: ApolloLink = new ApolloLinkTimeout(TIMEOUT_IN_MS)

const setOperationNameParam = (uri: string, operationName: string): RequestInfo | URL => {
  if (uri === '/api/graphql') {
    // web, uses relative url
    // appending operation manually, because we want the same (relative) request
    // (URL standard doesn't know how to transform relative urls)
    return uri + '?op=' + operationName
  } else if (!uri.startsWith('/')) {
    // mobile, or any non-relative url (which can be parsed by URL)
    try {
      const url = new URL(uri)
      url.searchParams.set('op', operationName)
      return url
    } catch (e) {
      // should not happen, but if it does, we need to see it
      // eslint-disable-next-line no-console
      console.error('unable to set operation name', e)
      return uri
    }
  } else {
    return uri
  }
}

const customFetch = (uri: RequestInfo, options: RequestInit | undefined) => {
  if (typeof uri === 'string' && typeof options?.body === 'string') {
    const body = JSON.parse(options.body)
    const operationName: string | undefined =
      'operationName' in body && typeof body.operationName === 'string' ? body.operationName : undefined

    if (operationName) {
      // using custom uri for easier debugging, logging, and sentry span creation config
      // e.g. /api/graphql?op=hasNewNotifications (web)
      // e.g. https://staging.unified.apis.holi.social/graphql?op=hasNewNotifications (mobile)
      return fetch(setOperationNameParam(uri, operationName), options)
    } else {
      return fetch(uri, options)
    }
  } else {
    return fetch(uri, options)
  }
}

// types don't match unfortunately, this seems to be a minor issue with the library
// the library includes its own node_modules with a dependency to apollo/client ^3.7.0
// must be last in chain, because it handles the actual call to the server
// (see https://www.apollographql.com/docs/react/api/link/introduction/ for introduction)
const uploadCapableTerminatingLink: ApolloLink = createUploadLink({
  uri: holiApiUrl,
  credentials: 'include',
  fetch: customFetch,
})

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
      InsightPaged: pagedPolicy(),
      AppDonations_ProjectsResponse: pagedPolicy(),
      AppVolunteering_EngagementsResponse: pagedPolicy(),
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
          tasks: alwaysReplacePolicy,
          sdgs: alwaysReplacePolicy,
          topics: alwaysReplacePolicy,
          links: alwaysReplacePolicy,
          collaborationTools: alwaysReplacePolicy,
          connectionStatusToMyself: alwaysReplacePolicy,
        },
      },
      SpacePaged: pagedPolicy(),
      SpaceMemberPaged: pagedPolicy(),
      SpaceMembershipRequestPaged: pagedPolicy(),
      SpaceInvitesPaged: pagedPolicy(),
      UserPaged: pagedPolicy(['substring']),
      PostPaged: pagedPolicy(),
      AppointmentPaged: pagedPolicy(['statusType']),
      Query: {
        fields: {
          // here, we can specify e.g. pagination behavior, depending on the
          // query, see https://www.apollographql.com/docs/react/pagination/overview
          appointments: {
            keyArgs: ['statusType'],
          },
          lastInsights: {
            keyArgs: [],
          },
          inspirationPosts: {
            keyArgs: [],
          },
          appDonations_projects: {
            keyArgs: ['location'],
          },
          appGoodNews_articles: {
            keyArgs: [],
          },
          appVolunteering_engagementOpportunities: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            keyArgs: (args: Record<string, any> | null) => {
              const { location, category } = args || {}
              return JSON.stringify({
                location: location?.geolocation?.properties?.place_id,
                category,
              })
            },
          },
          spaces: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            keyArgs: (args: Record<string, any> | null) => {
              // reminder: keep in sync with parameters of `spaces` in `Query`, always exclude offset and limit
              const { topicSlug, geolocation, skillSlugs, memberId } = args || {}
              return JSON.stringify({
                topicSlug,
                geolocation: geolocation?.properties?.place_id,
                skillSlugs,
                memberId,
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
          spacesByName: {
            keyArgs: ['substring'],
          },
          connectedUsers: {
            keyArgs: [],
          },
        },
      },
    },
  })

interface ApolloCreateClientOptions {
  readonly ssrMode: boolean
}

const API_URL = process.env.HOLI_API_URL
const ssrHttpLink = new HttpLink({ uri: API_URL, fetch: crossFetch })

const cache = createCache()

// Web authentication works using http-only cookies that are transparently added to requests by the Browser
// Mobile authentication works by adding the `X-Session-Token` header which takes its value from `SecureStorage`
// For mobile it is also necessary to explicitly set the Accept-Language header.
// `headerLink` is therefore only needed on Mobile (i.e. when defined)
const clientSideLink = from([headerLink, timeoutLink, errorLink, uploadCapableTerminatingLink].filter((link) => !!link))

const createApolloClient = ({ ssrMode }: ApolloCreateClientOptions) => {
  const clientLink = isSSR ? from([errorLink, ssrHttpLink]) : clientSideLink

  return new ApolloClient({
    ssrMode,
    link: clientLink,
    cache,
    assumeImmutableResults: true,
  })
}

// Web
/** This `let` variable can only be mutated by the initializeApolloSSRClient function. */
let apolloSSRClient: ApolloClient<NormalizedCacheObject> | null = null

type SSRClientInitState = Record<string, unknown> | null

export const initializeApolloSSRClient = (initState?: SSRClientInitState) => {
  const client = apolloSSRClient ?? createApolloClient({ ssrMode: isSSR })

  if (initState) {
    const { __META, ...existingCache } = client.extract()
    client.cache.restore({ __META, ...mergeDeepLeft(existingCache, initState) })
  }

  // For SSG and SSR always create a new Apollo Client
  if (isSSR) {
    return client
  }
  if (!apolloSSRClient) apolloSSRClient = client

  return client
}

// Mobile
// TODO: rename to recognize its only for client-side JS
export const client = createApolloClient({ ssrMode: false })

export default client
