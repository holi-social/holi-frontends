import type React from 'react'
import { BricksTheme } from 'holi-bricks/foundations/colors/themes/bricks-theme'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import RootProvider from '@holi/core/providers/RootProvider'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { initializeMobileApolloClient } from '@holi/api/graphql/client'
import { OnboardingAwaitingNavigator } from '@holi/mobile/navigation/OnboardingAwaitingNavigator'
import { SplashScreen } from 'expo-router'

const apolloClient = initializeMobileApolloClient()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BricksTheme initialTheme="light">
      <ThemeProvider theme={defaultHoliTheme}>
        <RootProvider apolloClient={apolloClient}>
          <KeyboardProvider>
            <OnboardingAwaitingNavigator
              onReady={async () => {
                await SplashScreen.hideAsync()
                return true
              }}
            >
              {children}
            </OnboardingAwaitingNavigator>
          </KeyboardProvider>
        </RootProvider>
      </ThemeProvider>
    </BricksTheme>
  )
}
