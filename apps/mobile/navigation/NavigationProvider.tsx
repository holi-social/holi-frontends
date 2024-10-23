import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

import type { LinkingOptions, Theme } from '@react-navigation/native'
import { DefaultTheme, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'

import { getLogger } from '@holi/core/helpers/logging'
import { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'
import { appendLocaleSubPaths } from '@holi/mobile/navigation/helpers/appendLocaleSubPaths'
import linkingConfig from '@holi/mobile/navigation/linkingConfig'
import { screenUrlFromNotificationResponse } from '@holi/mobile/notifications'
import { reactNativeTracingRoutingInstrumentation } from '@holi/mobile/tracing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const logger = getLogger('NavigationProvider')

export const navigationRef = createNavigationContainerRef<RootStackScreens>()

const getNavigationTheme = (currentTheme: HoliTheme): Theme => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    notification: currentTheme.colors.brandColorB30,
    background: currentTheme.colors.background10,
  },
  dark: currentTheme.dark,
})

// linking is done to configure deep linking (e.g. to get https://staging.dev.holi.social/profiles/dieter
// or holi://profiles/dieter to open the corresponding screen on the app). See
// https://reactnavigation.org/docs/deep-linking and https://reactnavigation.org/docs/configuring-links for details
export const rootLinkingConfig: LinkingOptions<RootStackScreens> = {
  prefixes: appendLocaleSubPaths([
    Linking.createURL('/'),
    'holi://',
    'https://app.holi.social',
    'https://*.dev.holi.social',
  ]),
  // this deep linking config needs to reflect the stacking structure of the navigators
  // see also https://reactnavigation.org/docs/configuring-links#mapping-path-to-route-names
  config: linkingConfig,
  getInitialURL: async () => {
    // we don't have a badge count concept yet,
    // so we just clear anything that is there on startup
    await Notifications.setBadgeCountAsync(0)

    const url = await Linking.getInitialURL()
    if (url != null) {
      logger.debug('LinkingOptions.getInitialURL', 'opening direct deep link', url)
      return url
    }

    const response = await Notifications.getLastNotificationResponseAsync()
    if (response) {
      logger.debug(
        'LinkingOptions.getInitialURL',
        'received response from push interaction, while app was closed',
        JSON.stringify(response)
      )
      const url = screenUrlFromNotificationResponse(response)
      if (url) {
        logger.debug('LinkingOptions.getInitialURL', 'navigate to deep link from push interaction', url)
        return url
      }
    }
  },
  subscribe: (listener) => {
    // listen to incoming links from deep linking, while app is active or in background
    const eventListenerSubscription = Linking.addEventListener('url', ({ url }: { url: string }) => {
      logger.debug('LinkingOptions.subscribe', 'received url from deeplinking', url)
      listener(url)
    })

    // listen to expo push notifications, while app is active or in background
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      logger.debug('LinkingOptions.subscribe', 'received response from push interaction', JSON.stringify(response))
      const url = screenUrlFromNotificationResponse(response)
      if (url) {
        logger.debug('LinkingOptions.subscribe', 'navigate to deep link from push interaction', url)
        listener(url)
      }
    })

    return () => {
      eventListenerSubscription.remove()
      subscription.remove()
    }
  },
}

const NavigationProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { theme } = useTheme()
  const navigationTheme = getNavigationTheme(theme)

  return (
    <>
      <StatusBar backgroundColor={theme.colors.background10} style={theme.dark ? 'light' : 'dark'} />

      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        linking={rootLinkingConfig}
        onReady={() => {
          reactNativeTracingRoutingInstrumentation.registerNavigationContainer(navigationRef)
        }}
      >
        {children}
      </NavigationContainer>
    </>
  )
}

export default NavigationProvider
