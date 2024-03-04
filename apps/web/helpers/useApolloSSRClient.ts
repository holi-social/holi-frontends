import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useMemo } from 'react'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { NextJSPageProps } from '@holi/web/types'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

export interface ApolloStateProps {
  [APOLLO_STATE_PROP_NAME]?: Record<string, unknown>
}

export const addApolloSSRState = (client: ApolloClient<NormalizedCacheObject>, props: Partial<NextJSPageProps>) => {
  return {
    ...props,
    // JSON transform as workaround for issue "`undefined` cannot be serialized as JSON. Please use `null` or omit this value all together."
    [APOLLO_STATE_PROP_NAME]: JSON.parse(JSON.stringify(client.cache.extract())),
  }
}

export const useApolloSSRClient = (props: ApolloStateProps) => {
  const state = props[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApolloSSRClient(state), [state])

  return store
}
