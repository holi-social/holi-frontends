import { ApolloProvider } from '@apollo/client'
import React from 'react'

import client from '@holi/api/graphql/client'

const ApolloProviderWrapper = ({ children }: React.PropsWithChildren<unknown>) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
export default ApolloProviderWrapper
