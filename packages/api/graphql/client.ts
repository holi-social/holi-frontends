import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client'
import ApolloLinkTimeout from 'apollo-link-timeout'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import { concat, mergeDeepLeft, pick, pipe, uniqBy } from 'ramda'

import { holiApiUrl } from '@holi/api/config'
import { isSSR } from '@holi/core/helpers/isSSR'

import authorizationHeaderLink from './authorizationHeaderLink'
import {
  alwaysReplacePolicy,
  keyArgsWithoutTypesenseMultiSearchPageInfo,
  typesenseMultiSearchPagedPolicy,
  pagedPolicy,
} from './cachePolicies'
import createLocaleHeaderLink from './createLocaleHeaderLink'
import errorLink from './errorLink'

type Headers = HttpLink.Options['headers']

// The HOLI backend needs ~35s for a cold boot (which it does on a regular basis as we scale to zero), timeout respects that
const TIMEOUT_IN_MS = 60 * 1000 // 60 seconds

const timeoutLink = new ApolloLinkTimeout(TIMEOUT_IN_MS)

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
const uploadCapableTerminatingLink: ApolloLink = new UploadHttpLink({
  uri: holiApiUrl,
  credentials: 'include',
  fetch: customFetch,
  isExtractableFile: customIsExtractableFile,
})

export const createCache = () =>
  new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          interests: alwaysReplacePolicy,
          skills: alwaysReplacePolicy,
        },
      },
      AuthenticatedUser: {
        fields: {
          interests: alwaysReplacePolicy,
          skills: alwaysReplacePolicy,
        },
      },
      Comment: {
        fields: {
          interests: alwaysReplacePolicy,
          skills: alwaysReplacePolicy,
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
      Typesense_MultiSearchResponse: {
        fields: {
          results: typesenseMultiSearchPagedPolicy(),
        },
      },
      Query: {
        fields: {
          appEvents_events: pagedPolicy(),
          appointments: pagedPolicy(),
          lastInsights: pagedPolicy(),
          appDonations_projects: pagedPolicy(),
          appGoodNews_articles: {
            keyArgs: [],
          },
          comments: {
            keyArgs: [],
          },
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
          connectedUsers: pagedPolicy(),
          favorites: pagedPolicy(),
          committedVolunteeringOpportunities: pagedPolicy(),
          myPosts: pagedPolicy(),
          postsByUserId: pagedPolicy(),
          translate: {
            keyArgs: [],
          },
          feed: pagedPolicy(),
          typesense_multiSearch: {
            keyArgs: keyArgsWithoutTypesenseMultiSearchPageInfo,
          },
          rewards_transactions: pagedPolicy(),
        },
      },
    },
  })

const API_URL = 'http://localhost:3000/api/graphql'
const createSsrHttpLink = (requestHeaders?: Headers) => {
  // Filter content negotiation headers except accept-language
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accept, 'accept-encoding': acceptEncoding, ...headers } = requestHeaders || {}

  return new HttpLink({ uri: API_URL, headers })
}

// Web authentication works using http-only cookies that are transparently added to requests by the Browser
// Mobile authentication works by adding the `X-Session-Token` header which takes its value from `SecureStorage`
// For mobile it is also necessary to explicitly set the Accept-Language header.
// `authorizationHeaderLink` is therefore only needed on Mobile (i.e. when defined)
const createClientSideLink = (locale?: string, headers?: Headers) =>
  ApolloLink.from(
    [
      headers ? new HttpLink({ headers }) : undefined,
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
}: { locale?: string; headers?: Headers; ssrMode?: boolean }) => {
  const clientLink = isSSR
    ? ApolloLink.from([createLocaleHeaderLink(locale), errorLink, createSsrHttpLink(headers)])
    : createClientSideLink(locale, headers)

  return new ApolloClient({
    ssrMode,
    link: clientLink,
    cache: createCache(),
    assumeImmutableResults: true,

    // Trying to connect to apollo dev tools (browser extension) does not make sense during ssr and leads to logging noise
    devtools: {
      enabled: isSSR ? false : undefined,
    },
  })
}

// Web
/** This `let` variable can only be mutated by the initializeWebClientApolloClient function. */
let apolloWebClient: ApolloClient | null = null

type WebClientInitState = Record<string, unknown> | null

export interface WebApolloClientOptions {
  initState?: WebClientInitState
  headers?: Record<string, string>
  locale?: string
}

export const initializeWebApolloClient = ({ initState, headers, locale }: WebApolloClientOptions = {}) => {
  const client = apolloWebClient ?? createApolloClient({ ssrMode: true, headers, locale })

  if (initState) {
    // @ts-ignore TODO(SF)
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
