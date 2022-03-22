import React, { useMemo } from 'react'
import * as Linking from 'expo-linking'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import defaultHoliTheme from 'shared/styles/theme'

const theTheme = {
  ...DefaultTheme,
  ...defaultHoliTheme,
}

export const NavigationProvider: React.FC = ({ children }) => (
  <NavigationContainer
    theme={theTheme}
    linking={useMemo(
      () => ({
        prefixes: [Linking.createURL('/')],
        config: {
          initialRouteName: 'Home',
          screens: {
            Home: '',
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
