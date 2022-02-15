// Must be the first import !!!
import 'react-native-gesture-handler';
import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native'
import { enableScreens } from 'react-native-screens'
import { ScreensStack } from './screens/stack'

import { NativeBaseProvider } from 'native-base';
import holiTheme from 'shared/styles/holi-theme'

enableScreens(true)

export default function App() {

  return (
    <NativeBaseProvider theme={holiTheme}>
      <NavigationContainer>
        <ScreensStack />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
