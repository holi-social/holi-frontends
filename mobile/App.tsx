
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { ApolloProvider } from "@apollo/client"
import NavigationStack from './screens/NavigationStack'
import NavigationDrawer from './screens/NavigationDrawer'
import holiTheme from './themes/holi'
import client from "shared/graphql/client"


const theTheme = {
  ...DefaultTheme,
  ...holiTheme,
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer theme={theTheme}>
        {/* <NavigationStack /> */}
        <NavigationDrawer />
      </NavigationContainer>
    </ApolloProvider>
  )
}
