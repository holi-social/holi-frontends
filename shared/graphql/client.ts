import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client"

// relevant for emulators and devices
const LOCAL_IP = "localhost" // 172.16.110.186

const client = new ApolloClient({
  uri: `http://${LOCAL_IP}:4000/graphql`,
  cache: new InMemoryCache(),
})

export default client
