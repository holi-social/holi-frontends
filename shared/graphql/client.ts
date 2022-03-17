import { ApolloClient, InMemoryCache } from '@apollo/client'
import { offsetLimitPagination } from '@apollo/client/utilities'
import { Platform } from 'react-native'

// relevant for emulators and devices
// for Android, see https://stackoverflow.com/questions/9808560/why-do-we-use-10-0-2-2-to-connect-to-local-web-server-instead-of-using-computer
const LOCAL_IP = Platform.OS === 'android' ? '10.0.2.2' : 'localhost' // 172.16.110.186

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
})

export default client
