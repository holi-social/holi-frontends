import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useMemo } from 'react'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { APOLLO_STATE_PROP_NAME, type NextJSPageProps } from '@holi/web/types'

export const createApolloPageProps = (client: ApolloClient<NormalizedCacheObject> | undefined) => {
  if (!client) {
    return {}
  }

  return {
    // JSON transform as workaround for issue "`undefined` cannot be serialized as JSON. Please use `null` or omit this value all together."
    // see open NextJS issue: https://github.com/vercel/next.js/discussions/11209
    [APOLLO_STATE_PROP_NAME]: JSON.parse(JSON.stringify(client.cache.extract())),
  }
}

export const createApolloSSRClient = (props: NextJSPageProps) => {
  const state = props[APOLLO_STATE_PROP_NAME]
  return initializeApolloSSRClient(state)
}

export const useApolloSSRClient = (props: NextJSPageProps) => {
  const store = useMemo(() => createApolloSSRClient(props), [props])

  return store
}
