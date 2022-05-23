import * as Linking from 'expo-linking'
import React, { useMemo } from 'react'

import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import type { Theme } from '@react-navigation/native'

import defaultHoliTheme from '@holi/ui/styles/theme'

const theTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    notification: defaultHoliTheme.colors.secondaryColor,
  },
  dark: defaultHoliTheme.dark,
}

export const NavigationProvider: React.FC = ({ children }) => (
  <NavigationContainer
    theme={theTheme}
    linking={useMemo(
      () => ({
        prefixes: [Linking.createURL('/')],
        config: {
          initialRouteName: 'PrivateSpace',
          screens: {
            PrivateSpace: '',
            AppStore: 'appstore',
            Community: 'community',
            Settings: 'settings',
            Login: 'login',
            Logout: 'logout',
            Registration: 'registration',
            UserProfile: 'profile',
          },
        },
      }),
      []
    )}
  >
    {children}
  </NavigationContainer>
)
