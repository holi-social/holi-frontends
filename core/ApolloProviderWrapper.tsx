import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import React, { useEffect, useState } from 'react'

import { createApolloClientWithStoredCache } from '@holi/api/graphql/client'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const ApolloProviderWrapper = ({ children }: React.PropsWithChildren<unknown>) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()

  useEffect(() => {
    createApolloClientWithStoredCache().then(setClient)
  }, [])

  return client ? <ApolloProvider client={client}>{children}</ApolloProvider> : <HoliLoader />
}

export default ApolloProviderWrapper
