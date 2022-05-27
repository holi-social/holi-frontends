import * as Linking from 'expo-linking'
import React, { useMemo } from 'react'

import type { Theme } from '@react-navigation/native'
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

export const NavigationProvider: React.FC = ({ children }) => (
  <NavigationContainer
    theme={navigationTheme}
    linking={useMemo(
      () => ({
        prefixes: [Linking.createURL('/'), 'holi://', 'https://*.web.project-holi.org'],
        config: {
          initialRouteName: 'App',
          screens: {
            // the actual app
            Core: {
              screens: {
                Home: {
                  screens: {
                    HomeFeed: '',
                    Topic: 'topics/:topicId',
                    Post: 'topics/:topicId/posts/:postId',
                    UserProfile: 'profile/:userId',
                    Notifications: 'notifications',
                  },
                },
                Chat: {
                  screens: {
                    ChatHome: 'chat',
                  },
                },
                Search: {
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
            TopicEditorModal: 'topics/:topicId/editors',
          },
        },
      }),
      []
    )}
  >
    {children}
  </NavigationContainer>
)
