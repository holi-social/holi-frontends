import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'
import React from 'react'

import type { LinkingOptions, Theme } from '@react-navigation/native'
import { DefaultTheme, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'

import { logDebug } from '@holi/core/helpers/logging'
import { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'
import linkingConfig from '@holi/mobile/navigation/linkingConfig'
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

const transformPushInteractionToUrl = (response: Notifications.NotificationResponse) => {
  const request: Partial<Notifications.NotificationRequest> = response.notification.request
  let data: Record<string, string> = {}

  if (request.trigger?.type === 'push') {
    // background or closed app push
    const trigger = request.trigger as Partial<Notifications.PushNotificationTrigger>
    const triggerData = trigger?.remoteMessage?.data
    if (triggerData) {
      data = triggerData
    }
  } else if (request?.content?.data) {
    // active app push
    data = request?.content?.data
  }

  const roomId = data.room_id
  if (roomId) {
    logDebug('transformPushInteractionToUrl', 'navigating to room', roomId)
    return 'https://app.holi.social/chat/rooms/' + roomId
  }
  return null
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
    const url = await Linking.getInitialURL()
    if (url != null) {
      logDebug('LinkingOptions.getInitialURL', 'opening direct deep link', url)
      return url
    }

    const response = await Notifications.getLastNotificationResponseAsync()
    if (response) {
      // TODO use this real example data for test
      // {
      //   notification: {
      //     request: {
      //       trigger: {
      //         remoteMessage: {
      //           originalPriority: 1,
      //           sentTime: 1692015244341,
      //           notification: null,
      //           data: {
      //             channelId: 'expo_notifications_fallback_notification_channel',
      //             message: 'You have a new message or invitation.',
      //             content: '{...}',
      //             room_id: '!qwGdHhthYWLZHsDwuG:staging.chat.holi.social',
      //             sender: '@malte1:staging.chat.holi.social',
      //             type: 'm.room.message',
      //             sender_display_name: 'malte1',
      //             prio: 'high',
      //             unread: '1',
      //             experienceId: '@holistic-foundation/projectholi',
      //             scopeKey: '@holistic-foundation/projectholi',
      //             event_id: '$iEfUuhURTKVUoZNuUlJeMDpyIK0kSMTmhOSR1kJoGeY',
      //             title: 'holi Chat',
      //           },
      //           to: null,
      //           ttl: 2419200,
      //           collapseKey: null,
      //           messageType: null,
      //           priority: 1,
      //           from: '984061681268',
      //           messageId: '0:1692015244354449%b0aa3b58f9fd7ecd',
      //         },
      //         channelId: 'expo_notifications_fallback_notification_channel',
      //         type: 'push',
      //       },
      //       content: {
      //         title: 'holi Chat',
      //         badge: null,
      //         autoDismiss: true,
      //         data: null,
      //         body: 'You have a new message or invitation.',
      //         sound: 'default',
      //         sticky: false,
      //         subtitle: null,
      //       },
      //       identifier: '0:1692015244354449%b0aa3b58f9fd7ecd',
      //     },
      //     date: 1692015244341,
      //   },
      //   actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      // }

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
      return listener(url)
    })

    // listen to expo push notifications, while app is active or in background
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      // TODO use this real example data (of active app push) for test
      // {
      //   notification: {
      //     request: {
      //       trigger: null,
      //       content: {H
      //         title: 'malte1',
      //         badge: null,
      //         autoDismiss: true,
      //         data: { room_id: '!qwGdHhthYWLZHsDwuG:staging.chat.holi.social' },
      //         body: 'something',
      //         sound: 'default',
      //         sticky: false,
      //         subtitle: null,
      //       },
      //       identifier: 'e3319d84-02a0-4467-8159-07d48c04efc2',
      //     },
      //     date: 1692017592571,
      //   },
      //   actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      // }

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
