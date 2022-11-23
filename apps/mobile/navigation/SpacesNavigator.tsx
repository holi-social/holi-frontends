import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/SpaceDetails'
import Spaces from '@holi/core/screens/spaces/Spaces'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'

export type SpacesStackScreensList = {
  SpacesHome: undefined
  SpaceDetails: SpaceDetailsParams
}

const SpacesStack = createNativeStackNavigator<SpacesStackScreensList>()

const SpacesStackNavigator: React.VFC = () => {
  return (
    <SpacesStack.Navigator
      initialRouteName="SpacesHome"
      screenOptions={{
        header: HeaderAnimated,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <SpacesStack.Screen name="SpacesHome" component={Spaces} />
      <SpacesStack.Screen
        name="SpaceDetails"
        options={{
          animation: 'slide_from_bottom',
          headerTitleStyle: {
            color: 'transparent',
          },
        }}
        component={SpaceDetails}
      />
    </SpacesStack.Navigator>
  )
}

export default SpacesStackNavigator
