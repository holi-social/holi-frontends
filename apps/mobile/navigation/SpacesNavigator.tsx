import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/SpaceDetails'
import Spaces from '@holi/core/screens/spaces/Spaces'
import SpacesForTopic, { SpacesForTopicParams } from '@holi/core/screens/spaces/SpacesForTopic'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesStackScreensList = {
  SpacesHome: undefined
  SpaceDetails: SpaceDetailsParams
  SpacesForTopic: SpacesForTopicParams
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
      <SpacesStack.Screen name={RouteName.SpacesForTopic} component={SpacesForTopic} />
    </SpacesStack.Navigator>
  )
}

export default SpacesStackNavigator
