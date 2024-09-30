import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useMemo } from 'react'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import type { HoliPageProps } from '@holi/web/types'

export const createApolloPageProps = (client: ApolloClient<NormalizedCacheObject> | undefined) => {
  if (!client) {
    return undefined
  }

  // JSON transform as workaround for issue "`undefined` cannot be serialized as JSON. Please use `null` or omit this value all together."
  // see open NextJS issue: https://github.com/vercel/next.js/discussions/11209
  return JSON.parse(JSON.stringify(client.cache.extract()))
}

export const createApolloSSRClient = (props: HoliPageProps, headers?: Record<string, string>) => {
  const state = props.apolloState
  return initializeApolloSSRClient({ initState: state, headers })
}

export const useApolloSSRClient = (props: HoliPageProps) => {
  const store = useMemo(() => createApolloSSRClient(props), [props])

  return store
}
