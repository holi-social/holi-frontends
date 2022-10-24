import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Spaces from '@holi/core/screens/Spaces'
import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/SpaceDetails'
import { colors } from '@holi/ui/styles/globalVars'

import { CenterElement, LeftElement, RightElement } from './components'

export type SpacesStackScreensList = {
  Spaces: undefined
  SpaceDetails: SpaceDetailsParams
}

const SpacesStack = createNativeStackNavigator<SpacesStackScreensList>()
const SpacesStackNavigator: React.VFC = () => {
  return (
    <SpacesStack.Navigator
      initialRouteName="Spaces"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <SpacesStack.Screen
        name="Spaces"
        component={Spaces}
        options={{
          headerBackTitleVisible: true,
          headerBackVisible: true,
          headerTitle: CenterElement,
          headerLeft: LeftElement,
          headerRight: RightElement,
        }}
      />
      <SpacesStack.Screen
        name="SpaceDetails"
        component={SpaceDetails}
        options={{
          headerShown: true,
        }}
      />
    </SpacesStack.Navigator>
  )
}

export default SpacesStackNavigator
