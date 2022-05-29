import { RootStackScreensList } from 'apps/mobile/navigation/rootNavigator'
import * as Linking from 'expo-linking'
import React from 'react'

import type { LinkingOptions, Theme } from '@react-navigation/native'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'

import defaultHoliTheme from '@holi/ui/styles/theme'

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    notification: defaultHoliTheme.colors.secondaryColor,
  },
  dark: defaultHoliTheme.dark,
}

// linking is done to configure deep linking (e.g. to get https://staging.web.project-holi.org/profiles/dieter
// or holi://profiles/dieter to open the corresponding screen on the app). See
// https://reactnavigation.org/docs/deep-linking and https://reactnavigation.org/docs/configuring-links for details
const rootLinkingConfig: LinkingOptions<RootStackScreensList> = {
  prefixes: [Linking.createURL('/'), 'holi://', 'https://*.web.project-holi.org'],
  // this deep linking config needs to reflect the stacking structure of the navigators
  // see also https://reactnavigation.org/docs/configuring-links#mapping-path-to-route-names
  config: {
    initialRouteName: 'Core',
    screens: {
      // the actual app
      Core: {
        screens: {
          Home: {
            initialRouteName: 'HomeFeed',
            screens: {
              HomeFeed: '',
              Topic: 'topics/:topicId',
              Post: 'topics/:topicId/posts/:postId',
              UserProfile: 'profile/:userId',
              Notifications: 'notifications',
            },
          },
          Chat: {
            initialRouteName: 'ChatHome',
            screens: {
              ChatHome: 'chat',
            },
          },
          Search: {
            initialRouteName: 'Search',
            screens: {
              Search: 'search',
            },
          },
        },
      },
      // apps from the HOLI store
      VolunteeringApp: {
        screens: {
          VolunteeringAppHome: 'apps/volunteering',
        },
      },
      // all modals
      Login: 'login',
      Logout: 'logout',
      Registration: 'registration',
      TopicEditorsScreen: 'topics/:topicId/editors',
    },
  },
}

export const NavigationProvider: React.FC = ({ children }) => (
  <NavigationContainer theme={navigationTheme} linking={rootLinkingConfig}>
    {children}
  </NavigationContainer>
)
