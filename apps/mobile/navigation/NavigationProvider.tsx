import * as Linking from 'expo-linking'
import React from 'react'

import type { LinkingOptions, Theme } from '@react-navigation/native'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'

import { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'
import linkingConfig from '@holi/mobile/navigation/linkingConfig'
import { colors } from '@holi/ui/styles/globalVars'
import defaultHoliTheme from '@holi/ui/styles/theme'

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    notification: colors.secondaryColor,
    background: colors.backgroundColorWhite,
  },
  dark: defaultHoliTheme.dark,
}

// linking is done to configure deep linking (e.g. to get https://staging.web.project-holi.org/profiles/dieter
// or holi://profiles/dieter to open the corresponding screen on the app). See
// https://reactnavigation.org/docs/deep-linking and https://reactnavigation.org/docs/configuring-links for details
export const rootLinkingConfig: LinkingOptions<RootStackScreens> = {
  prefixes: [Linking.createURL('/'), 'holi://', 'https://*.web.project-holi.org'],
  // this deep linking config needs to reflect the stacking structure of the navigators
  // see also https://reactnavigation.org/docs/configuring-links#mapping-path-to-route-names
  config: linkingConfig,
}

const NavigationProvider: React.FC = ({ children }) => (
  <NavigationContainer theme={navigationTheme} linking={rootLinkingConfig}>
    {children}
  </NavigationContainer>
)

export default NavigationProvider
