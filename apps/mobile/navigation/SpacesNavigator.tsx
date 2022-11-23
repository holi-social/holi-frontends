import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/SpaceDetails'
import Spaces from '@holi/core/screens/spaces/Spaces'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'
import { colors } from '@holi/ui/styles/globalVars'

import { RouteName } from './types'

export type SpacesStackScreensList = {
  SpacesHome: undefined
  SpaceDetails: SpaceDetailsParams
}

const SpacesStack = createNativeStackNavigator<SpacesStackScreensList>()

const SpacesStackNavigator: React.VFC = () => {
  return (
    <SpacesStack.Navigator
      initialRouteName={RouteName.SpacesHome}
      screenOptions={{
        header: HeaderAnimated,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
        },
      }}
    >
      <SpacesStack.Screen name={RouteName.SpacesHome} component={Spaces} />
      <SpacesStack.Screen name={RouteName.SpaceDetails} component={SpaceDetails} />
    </SpacesStack.Navigator>
  )
}

export default SpacesStackNavigator
