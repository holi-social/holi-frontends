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
        prefixes: [Linking.createURL('/')],
        config: {
          initialRouteName: 'HomeFeed',
          screens: {
            Home: {
              screens: {
                HomeFeed: '',
                Topic: 'topics/:topicId',
                TopicEditorModal: 'topics/:topicId/editors',
                Post: 'topics/:topicId/posts/:postId',
                UserProfile: 'profile/:userId',
                Notifications: 'notifications',
                Login: 'login',
                Logout: 'logout',
                Registration: 'registration',
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
      }),
      []
    )}
  >
    {children}
  </NavigationContainer>
)
