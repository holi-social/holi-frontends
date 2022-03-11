import React from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { ApolloProvider } from '@apollo/client'
import { SkeletonNav } from 'shared/components/navigation/NavSkeleton'
import defaultHoliTheme, { ThemeProvider } from 'shared/styles/theme'
import client from 'shared/graphql/client'

const theTheme = {
  ...DefaultTheme,
  ...defaultHoliTheme,
}

const App: React.VoidFunctionComponent = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultHoliTheme}>
        <NavigationContainer theme={theTheme}>
          <SkeletonNav />
        </NavigationContainer>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
