import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Spaces from '@holi/core/screens/spaces/discover/Spaces'
import FilteredSpaces from '@holi/core/screens/spaces/filter/FilteredSpaces'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesStackScreensList = {
  [RouteName.SpacesHome]: undefined
  [RouteName.FilteredSpaces]: undefined
}

const SpacesStack = createNativeStackNavigator<SpacesStackScreensList>()

const SpacesHomeNavigator = () => {
  return (
    <SpacesStack.Navigator
      initialRouteName={RouteName.SpacesHome}
      screenOptions={{ headerTintColor: colors.black300, headerShown: false }}
    >
      <SpacesStack.Screen name={RouteName.SpacesHome} component={Spaces} />
      <SpacesStack.Screen name={RouteName.FilteredSpaces} component={FilteredSpaces} />
    </SpacesStack.Navigator>
  )
}

export default SpacesHomeNavigator
