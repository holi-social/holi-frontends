import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";

// relevant for emulators and devices
const LOCAL_IP = "localhost"; // 172.16.110.186

const client = new ApolloClient({
  uri: `http://${LOCAL_IP}:4000/graphql`,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allPosts: offsetLimitPagination(),
          allUsers: offsetLimitPagination()
        },
      },
    },
  }),
});

export default client;
