import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi//mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

import GoodNewsAppHome from '@holi-apps/goodnews/screens/GoodNewsAppHome'

export type GoodNewsAppScreensList = {
  [RouteName.GoodNewsAppHome]: undefined
}

const GoodNewsAppStack = createNativeStackNavigator<GoodNewsAppScreensList>()

const GoodNewsAppNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme
  return (
    <GoodNewsAppStack.Navigator
      initialRouteName={RouteName.GoodNewsAppHome}
      screenOptions={{
        header: HeaderAnimated,
        headerShown: true,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.background10,
        },
      }}
    >
      <GoodNewsAppStack.Screen name={RouteName.GoodNewsAppHome} component={GoodNewsAppHome} />
    </GoodNewsAppStack.Navigator>
  )
}

export default GoodNewsAppNavigator
