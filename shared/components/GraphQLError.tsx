import React from 'react'
import { ApolloError } from '@apollo/client'
import { Text } from 'react-native'

const GraphQLError: React.VoidFunctionComponent<{ error: ApolloError }> = ({
  error,
}) => {
  if (error.message) {
    return <Text>{error.message}</Text>
  } else {
    return (
      <Text>
        Errors: {JSON.stringify(error)}
        {error.graphQLErrors.map(({ message }, i) => (
          <Text key={i}>{message}</Text>
        ))}
      </Text>
    )
  }
}

export default GraphQLError
