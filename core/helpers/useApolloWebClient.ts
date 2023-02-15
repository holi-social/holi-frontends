import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useMemo } from 'react'

import { initializeApolloWebClient } from '@holi/api/graphql/client'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

interface PageProps {
  readonly props: {
    [APOLLO_STATE_PROP_NAME]: unknown
  }
}

export const addApolloWebState = (client: ApolloClient<NormalizedCacheObject>, pageProps: PageProps) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export const useApolloWebClient = (props: { readonly [APOLLO_STATE_PROP_NAME]: unknown }) => {
  const state = props[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApolloWebClient(state as unknown as null), [state]) // FIXME: pass the right types if known
  return store
}
