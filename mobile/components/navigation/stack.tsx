import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from '../../screens/Home'
import { ColorsScreen } from '../../screens/Colors'

const Stack = createNativeStackNavigator()

export const ScreensStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Colors" component={ColorsScreen} />
    </Stack.Navigator>
  )
}
