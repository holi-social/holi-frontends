// Must be the first import !!!
import 'react-native-gesture-handler';
import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from './components/navigation/rootNavigation';
import FooterNavigation from './components/navigation/FooterNavigation'
import { enableScreens } from 'react-native-screens'
import { ScreensStack } from './components/navigation/stack'

import { NativeBaseProvider, Box } from 'native-base';
import holiTheme from 'shared/styles/holi-theme'

enableScreens(true)

export default function App() {

  return (
    <NativeBaseProvider theme={holiTheme}>
      <Box style={{ display: 'flex' }} height="100%" safeArea>
        <NavigationContainer ref={navigationRef}>
          <ScreensStack />
        </NavigationContainer>

        <FooterNavigation />

      </Box>
    </NativeBaseProvider>
  );
}
