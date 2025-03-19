import type { ApolloClientOptions, HttpOptions, NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, type ApolloLink, HttpLink, InMemoryCache, from } from '@apollo/client'
import ApolloLinkTimeout from 'apollo-link-timeout'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { concat, mergeDeepLeft, pick, pipe, uniqBy } from 'ramda'

import { holiApiUrl } from '@holi/api/config'
import { isSSR } from '@holi/core/helpers/isSSR'

import authorizationHeaderLink from './authorizationHeaderLink'
import { alwaysReplacePolicy, keyArgsWithoutLimitAndOffset, pagedPolicy } from './cachePolicies'
import createLocaleHeaderLink from './createLocaleHeaderLink'
import errorLink from './errorLink'

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

const customFetch = (uri: RequestInfo | URL, options: RequestInit | undefined) => {
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

// Copied from from https://github.com/jaydenseric/apollo-upload-client/issues/331#issuecomment-2068428496 as it was removed from 'apollo-upload-client'
export class ReactNativeFile {
  uri: string
  name: string
  type: string
  constructor({ uri, name, type }: { uri: string; name: string; type: string }) {
    this.uri = uri
    this.name = name
    this.type = type
  }
}

function customIsExtractableFile(value: unknown): value is ReactNativeFile | File {
  return value instanceof ReactNativeFile || value instanceof File
}

// must be last in chain, because it handles the actual call to the server
// (see https://www.apollographql.com/docs/react/api/link/introduction/ for introduction)
// @ts-ignore type incompatibility would need to be fixed in apollo-upload-client library
const uploadCapableTerminatingLink: ApolloLink = createUploadLink({
  uri: holiApiUrl,
  credentials: 'include',
  fetch: customFetch,
  isExtractableFile: customIsExtractableFile,
})

export const createCache = () =>
  new InMemoryCache({
    typePolicies: {
      AppEvents_Event: {
        keyFields: ['id'],
      },
      User: {
        fields: {
          interests: alwaysReplacePolicy,
          skills: alwaysReplacePolicy,
          sdgs: alwaysReplacePolicy,
        },
      },
      AuthenticatedUser: {
        fields: {
          interests: alwaysReplacePolicy,
          skills: alwaysReplacePolicy,
          sdgs: alwaysReplacePolicy,
        },
      },
      Comment: {
        fields: {
          interests: alwaysReplacePolicy,
          skills: alwaysReplacePolicy,
          sdgs: alwaysReplacePolicy,
        },
      },
      AppGoodNews_GoodNewsArticlesQueryResponse: {
        fields: {
          articles: {
            merge: (existing = [], incoming = []) =>
              pipe<Record<'__ref', unknown>[][], Record<'__ref', unknown>[], Record<'__ref', unknown>[]>(
                concat,
                uniqBy(pick(['__ref']))
              )(existing, incoming),
            read: (existing) => existing,
          },
        },
      },
      Space: {
        fields: {
          tasks: alwaysReplacePolicy,
          sdgs: alwaysReplacePolicy,
          links: alwaysReplacePolicy,
          collaborationTools: alwaysReplacePolicy,
          connectionStatusToMyself: alwaysReplacePolicy,
          posts: pagedPolicy(),
          members: pagedPolicy(),
          membershipRequests: pagedPolicy(),
          invites: pagedPolicy(),
          parentSpace: alwaysReplacePolicy,
          childSpaces: pagedPolicy(),
        },
      },
      Query: {
        fields: {
          // here, we can specify e.g. pagination behavior, depending on the
          // query, see https://www.apollographql.com/docs/react/pagination/overview
          appEvents_event: alwaysReplacePolicy,
          appEvents_events: pagedPolicy((args: Record<string, unknown> | null) => {
            return keyArgsWithoutLimitAndOffset(args)
          }),
          appointments: pagedPolicy(),
          lastInsights: pagedPolicy(),
          appDonations_projects: pagedPolicy(),
          appGoodNews_articles: {
            keyArgs: [],
          },
          comments: {
            keyArgs: [],
          },
          appVolunteering_engagementRecosV2: pagedPolicy(),
          appVolunteering_similarRecommendations: pagedPolicy(),
          appVolunteering_filteredEngagementsV2: pagedPolicy(),
          spaces: pagedPolicy(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (args: Record<string, any> | null) => {
              // reminder: keep in sync with parameters of `spaces` in `Query`, always exclude offset and limit
              const { topicsV2, geolocation, skillsV2, memberId } = args || {}
              return JSON.stringify({
                geolocation: geolocation?.properties?.place_id,
                topicsV2,
                skillsV2,
                memberId,
              })
            }
          ),
          discoverSpaces: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            keyArgs: (args: Record<string, any> | null) => {
              // reminder: keep in sync with parameters of `discoverSpaces` in `Query`, always exclude offset and limit
              const { topicsV2, geolocation, skillsV2 } = args || {}
              return JSON.stringify({
                topicsV2,
                geolocation: geolocation?.properties?.place_id,
                skillsV2,
              })
            },
          },
          userByName: pagedPolicy(),
          spacesByName: pagedPolicy(),
          connectedUsers: pagedPolicy(),
          favorites: pagedPolicy(),
          myPosts: pagedPolicy(),
          allPosts: pagedPolicy(),
          postsByUserId: pagedPolicy(),
          translate: {
            keyArgs: [],
          },
          feed: pagedPolicy(),
        },
      },
    },
  })

const API_URL = 'http://localhost:3000/api/graphql'
const createSsrHttpLink = (requestHeaders?: HttpOptions['headers']) => {
  // Filter content negotiation headers except accept-language
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accept, 'accept-encoding': acceptEncoding, ...headers } = requestHeaders || {}

  return new HttpLink({ uri: API_URL, headers })
}

// Web authentication works using http-only cookies that are transparently added to requests by the Browser
// Mobile authentication works by adding the `X-Session-Token` header which takes its value from `SecureStorage`
// For mobile it is also necessary to explicitly set the Accept-Language header.
// `authorizationHeaderLink` is therefore only needed on Mobile (i.e. when defined)
const createClientSideLink = (locale?: string) =>
  from(
    [
      createLocaleHeaderLink(locale),
      authorizationHeaderLink,
      timeoutLink,
      errorLink,
      uploadCapableTerminatingLink,
    ].filter((link) => !!link)
  )

const createApolloClient = ({
  ssrMode,
  headers,
  locale,
}: Pick<ApolloClientOptions<NormalizedCacheObject>, 'ssrMode' | 'headers'> & { locale?: string }) => {
  const clientLink = isSSR
    ? from([createLocaleHeaderLink(locale), errorLink, createSsrHttpLink(headers)])
    : createClientSideLink(locale)

  return new ApolloClient({
    ssrMode,
    link: clientLink,
    cache: createCache(),
    assumeImmutableResults: true,
    // Trying to connect to apollo dev tools (browser extension) does not make sense during ssr and leads to logging noise
    connectToDevTools: isSSR ? false : undefined,
    headers,
  })
}

// Web
/** This `let` variable can only be mutated by the initializeWebClientApolloClient function. */
let apolloWebClient: ApolloClient<NormalizedCacheObject> | null = null

type WebClientInitState = Record<string, unknown> | null

export interface WebApolloClientOptions {
  initState?: WebClientInitState
  headers?: ApolloClientOptions<NormalizedCacheObject>['headers']
  locale?: string
}

export const initializeWebApolloClient = ({ initState, headers, locale }: WebApolloClientOptions = {}) => {
  const client = apolloWebClient ?? createApolloClient({ ssrMode: true, headers, locale })

  if (initState) {
    const { __META, ...existingCache } = client.extract()
    client.cache.restore({
      __META,
      ...mergeDeepLeft(existingCache, initState),
    })
  }

  if (isSSR) {
    // For SSG and SSR always create a new Apollo Client
    return client
  }

  if (!apolloWebClient) apolloWebClient = client

  return client
}

export const initializeMobileApolloClient = () => createApolloClient({ ssrMode: false })
