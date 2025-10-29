import type React from 'react'
import { useMemo } from 'react'
import { BricksTheme } from 'holi-bricks/foundations/colors/themes/bricks-theme'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import RootProvider from '@holi/core/providers/RootProvider'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { initializeMobileApolloClient } from '@holi/api/graphql/client'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AnalyticsAutoCapture from '@holi/mobile/navigation/AnalyticsAutoCapture'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const apolloClient = useMemo(() => initializeMobileApolloClient(), [])

  return (
    <GestureHandlerRootView>
      <BricksTheme initialTheme="light">
        <ThemeProvider theme={defaultHoliTheme}>
          <RootProvider apolloClient={apolloClient}>
            <AnalyticsAutoCapture>
              <KeyboardProvider>{children}</KeyboardProvider>
            </AnalyticsAutoCapture>
          </RootProvider>
        </ThemeProvider>
      </BricksTheme>
    </GestureHandlerRootView>
  )
}
