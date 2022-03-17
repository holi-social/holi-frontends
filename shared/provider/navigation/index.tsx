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
          initialRouteName: 'AppsHome',
          screens: {
            // cannot use Drawer here, which is the DrawerNavigator with initialRouteName = AppsHome
            // Drawer: '',
            AppsHome: '',
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
