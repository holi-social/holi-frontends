import { ApolloError } from "@apollo/client";
import { Text } from "react-native"

export default function GraphQLError({ error }: { error: ApolloError }) {
  if (error.message) {
    return <Text>{error.message}</Text>;
  } else {
    return (
      <Text>
        Errors: {JSON.stringify(error)}
        {error.graphQLErrors.map(({ message }, i) => (
          <Text key={i}>{message}</Text>
        ))}
      </Text>
    );
  }
}
