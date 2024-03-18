import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Spaces from '@holi/core/screens/spaces/discover/Spaces'
import FilteredSpaces from '@holi/core/screens/spaces/filter/FilteredSpacesPage'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'

export type SpacesStackScreensList = {
  [RouteName.SpacesHome]: undefined
  [RouteName.FilteredSpaces]: undefined
}

const SpacesStack = createNativeStackNavigator<SpacesStackScreensList>()

const SpacesHomeNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme
  return (
    <SpacesStack.Navigator
      initialRouteName={RouteName.SpacesHome}
      screenOptions={{
        header: HeaderAnimated,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.background10,
        },
      }}
    >
      <SpacesStack.Screen name={RouteName.SpacesHome} component={Spaces} />
      <SpacesStack.Screen name={RouteName.FilteredSpaces} component={FilteredSpaces} />
    </SpacesStack.Navigator>
  )
}

export default SpacesHomeNavigator
