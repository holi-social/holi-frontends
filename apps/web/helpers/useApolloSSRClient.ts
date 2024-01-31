import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useMemo } from 'react'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

export interface ApolloStateProps {
  [APOLLO_STATE_PROP_NAME]?: Record<string, unknown>
}

export const addApolloSSRState = <P extends ApolloStateProps>(
  client: ApolloClient<NormalizedCacheObject>,
  props: P
) => {
  props[APOLLO_STATE_PROP_NAME] = client.cache.extract()

  return props
}

export const useApolloClient = (props: ApolloStateProps) => {
  const state = props[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApolloSSRClient(state), [state])

  return store
}
