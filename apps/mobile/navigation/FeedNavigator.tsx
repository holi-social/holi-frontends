import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi/core/components/HeaderAnimated'
import NotFound from '@holi/core/screens/404/NotFound'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import Search from '@holi/core/screens/search/Search'
import UserProfile, { type UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'

export type FeedStackScreens = {
  [RouteName.HomeFeed]: undefined
  [RouteName.Search]: undefined
  [RouteName.NotFound]: undefined
  [RouteName.UserProfile]: UserProfileParams
}

const FeedStack = createNativeStackNavigator<FeedStackScreens>()

const FeedNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <FeedStack.Navigator
      initialRouteName={RouteName.HomeFeed}
      screenOptions={{
        header: HeaderAnimated,
        headerShadowVisible: false,
        headerTransparent: true,
        headerTintColor: colors.black300,
      }}
    >
      <FeedStack.Screen name={RouteName.HomeFeed} component={HomeFeed} />
      <FeedStack.Screen name={RouteName.Search} component={Search} />
      <FeedStack.Screen name={RouteName.UserProfile} component={UserProfile} />
      <FeedStack.Screen name={RouteName.NotFound} component={NotFound} />
    </FeedStack.Navigator>
  )
}

export default FeedNavigator
