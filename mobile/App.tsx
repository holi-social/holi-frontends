import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { ApolloProvider } from '@apollo/client'
import NavigationStack from './screens/_navigationStack'
import defaultHoliTheme, { ThemeProvider } from 'shared/styles/theme'
import client from 'shared/graphql/client'

const theTheme = {
  ...DefaultTheme,
  ...defaultHoliTheme,
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultHoliTheme}>
        <NavigationContainer theme={theTheme}>
          <NavigationStack />
        </NavigationContainer>
      </ThemeProvider>
    </ApolloProvider>
  )
}
