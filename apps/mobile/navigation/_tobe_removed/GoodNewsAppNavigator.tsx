import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RouteName } from '@holi/mobile/navigation/routeName'

import GoodNewsAppHome from '@holi-apps/goodnews/screens/GoodNewsAppHome'

export type GoodNewsAppScreensList = {
  [RouteName.GoodNewsAppHome]: undefined
}

const GoodNewsAppStack = createNativeStackNavigator<GoodNewsAppScreensList>()

const GoodNewsAppNavigator = () => {
  return (
    <GoodNewsAppStack.Navigator
      initialRouteName={RouteName.GoodNewsAppHome}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTransparent: true,
      }}
    >
      <GoodNewsAppStack.Screen name={RouteName.GoodNewsAppHome} component={GoodNewsAppHome} />
    </GoodNewsAppStack.Navigator>
  )
}

export default GoodNewsAppNavigator
