import React from 'react'

import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export type FeedStackScreens = {
  [RouteName.HomeFeed]: undefined
}

const FeedStack = createNativeStackNavigator<FeedStackScreens>()

const FeedNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <FeedStack.Navigator
      initialRouteName={RouteName.HomeFeed}
      screenOptions={{ headerTintColor: colors.black300, headerShadowVisible: false }}
    >
      <FeedStack.Screen name={RouteName.HomeFeed} component={HomeFeed} />
    </FeedStack.Navigator>
  )
}

export default FeedNavigator
