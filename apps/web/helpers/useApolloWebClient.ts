import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useMemo } from 'react'

import { initializeWebApolloClient } from '@holi/api/graphql/client'
import type { HoliPageProps } from '@holi/web/types'

export const createApolloPageProps = (client: ApolloClient | undefined) => {
  if (!client) {
    return undefined
  }

  // JSON transform as workaround for issue "`undefined` cannot be serialized as JSON. Please use `null` or omit this value all together."
  // see open NextJS issue: https://github.com/vercel/next.js/discussions/11209
  return JSON.parse(JSON.stringify(client.cache.extract()))
}

export const createApolloWebClient = (props: HoliPageProps, headers?: Record<string, string>) => {
  const state = props.apolloState
  return initializeWebApolloClient({ initState: state, headers, locale: props.locale })
}

export const useApolloWebClient = (props: HoliPageProps) => {
  const store = useMemo(() => createApolloWebClient(props), [props])

  return store
}
