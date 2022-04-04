import React, { useMemo } from 'react'
import * as Linking from 'expo-linking'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import type { Theme } from '@react-navigation/native'

import defaultHoliTheme from 'shared/styles/theme'

const theTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    notification: defaultHoliTheme.colors.secondary,
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
            CommunityFeedDetail: 'community/:feedId',
            Login: 'login',
            Logout: 'logout',
            Registration: 'registration',
          },
        },
      }),
      []
    )}
  >
    {children}
  </NavigationContainer>
)
