import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Spaces from '@holi/core/screens/spaces/discover/Spaces'
import FilteredSpaces from '@holi/core/screens/spaces/filter/FilteredSpaces'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'

export type SpacesStackScreensList = {
  [RouteName.SpacesHome]: undefined
  [RouteName.FilteredSpaces]: undefined
}

const SpacesStack = createNativeStackNavigator<SpacesStackScreensList>()

const SpacesHomeNavigator = () => {
  return (
    <SpacesStack.Navigator
      initialRouteName={RouteName.SpacesHome}
      screenOptions={{ headerTintColor: colors.black300, headerShown: false, headerShadowVisible: false }}
    >
      <SpacesStack.Screen name={RouteName.SpacesHome} component={Spaces} />
      <SpacesStack.Screen
        name={RouteName.FilteredSpaces}
        component={FilteredSpaces}
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTitleAlign: 'center',
          headerLeft: () => <HeaderBackButton />,
        }}
      />
    </SpacesStack.Navigator>
  )
}

export default SpacesHomeNavigator
