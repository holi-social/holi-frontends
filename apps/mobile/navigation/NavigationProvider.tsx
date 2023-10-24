import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'
import React from 'react'

import type { LinkingOptions, Theme } from '@react-navigation/native'
import { DefaultTheme, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'

import { logDebug } from '@holi/core/helpers/logging'
import { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'
import linkingConfig from '@holi/mobile/navigation/linkingConfig'
import { transformPushInteractionToUrl } from '@holi/mobile/notifications'
import { reactNativeTracingRoutingInstrumentation } from '@holi/mobile/tracing'
import { colors } from '@holi/ui/styles/globalVars'
import defaultHoliTheme from '@holi/ui/styles/theme'

export const navigationRef = createNavigationContainerRef()

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    notification: colors.brandColorB30,
    background: colors.background10,
  },
  dark: defaultHoliTheme.dark,
}

// linking is done to configure deep linking (e.g. to get https://staging.dev.holi.social/profiles/dieter
// or holi://profiles/dieter to open the corresponding screen on the app). See
// https://reactnavigation.org/docs/deep-linking and https://reactnavigation.org/docs/configuring-links for details
export const rootLinkingConfig: LinkingOptions<RootStackScreens> = {
  prefixes: [Linking.createURL('/'), 'holi://', 'https://app.holi.social', 'https://*.dev.holi.social'],
  // this deep linking config needs to reflect the stacking structure of the navigators
  // see also https://reactnavigation.org/docs/configuring-links#mapping-path-to-route-names
  config: linkingConfig,
  getInitialURL: async () => {
    // we don't have a badge count concept yet,
    // so we just clear anything that is there on startup
    await Notifications.setBadgeCountAsync(0)

    const url = await Linking.getInitialURL()
    if (url != null) {
      logDebug('LinkingOptions.getInitialURL', 'opening direct deep link', url)
      return url
    }

    const response = await Notifications.getLastNotificationResponseAsync()
    if (response) {
      logDebug(
        'LinkingOptions.getInitialURL',
        'received response from push interaction, while app was closed',
        JSON.stringify(response)
      )
      return transformPushInteractionToUrl(response)
    }
  },
  subscribe: (listener) => {
    // listen to incoming links from deep linking, while app is active or in background
    const eventListenerSubscription = Linking.addEventListener('url', ({ url }: { url: string }) => {
      logDebug('LinkingOptions.subscribe', 'received url from deeplinking', url)
      listener(url)
    })

    // listen to expo push notifications, while app is active or in background
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      logDebug('LinkingOptions.subscribe', 'received response from push interaction', JSON.stringify(response))
      const url = transformPushInteractionToUrl(response)
      if (url) {
        listener(url)
      }
    })

    return () => {
      eventListenerSubscription.remove()
      subscription.remove()
    }
  },
}

const NavigationProvider = ({ children }: React.PropsWithChildren<unknown>) => (
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
)

export default NavigationProvider
