import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ActHome from '@holi/core/screens/act/ActHome'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type ActStackScreensList = {
  [RouteName.ActHome]: undefined
}

const ActStack = createNativeStackNavigator<ActStackScreensList>()

const ActNavigator = () => {
  return (
    <ActStack.Navigator initialRouteName={RouteName.ActHome} screenOptions={{ headerShadowVisible: false }}>
      <ActStack.Screen name={RouteName.ActHome} component={ActHome} />
    </ActStack.Navigator>
  )
}

export default ActNavigator
