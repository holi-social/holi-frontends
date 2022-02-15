import * as React from 'react';
import { HomeScreen } from './Home'
import { ColorsScreen } from './Colors'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export const ScreensStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Colors" component={ColorsScreen} />
    </Stack.Navigator>
  )
}
