import { ApolloError } from '@apollo/client'
import React from 'react'

import HoliText from '@holi/ui/components/HoliText'

const GraphQLError: React.VoidFunctionComponent<{ error: ApolloError }> = ({ error }) => {
  if (error.message) {
    return <HoliText>{error.message}</HoliText>
  } else {
    return (
      <HoliText>
        Errors: {JSON.stringify(error)}
        {error.graphQLErrors.map(({ message }, i) => (
          <HoliText key={i}>{message}</HoliText>
        ))}
      </HoliText>
    )
  }
}

export default GraphQLError
