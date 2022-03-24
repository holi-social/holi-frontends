import React, { useMemo } from 'react'
import * as Linking from 'expo-linking'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import type { Theme } from '@react-navigation/native'

import defaultHoliTheme from 'shared/styles/theme'

const theTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: defaultHoliTheme.colors.primary,
    notification: defaultHoliTheme.colors.notification,
    background: defaultHoliTheme.colors.background,
    text: defaultHoliTheme.colors.text,
    border: defaultHoliTheme.colors.border,
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
          },
        },
      }),
      []
    )}
  >
    {children}
  </NavigationContainer>
)
