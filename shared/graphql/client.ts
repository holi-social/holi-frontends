import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { Platform } from "react-native";

// relevant for emulators and devices
const LOCAL_IP = Platform.OS === "android" ? "10.0.2.2" : "localhost"; // 172.16.110.186

const client = new ApolloClient({
  uri: `http://${LOCAL_IP}:4000/graphql`,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allPosts: offsetLimitPagination(),
          allUsers: offsetLimitPagination(),
        },
      },
    },
  }),
});

export default client;
