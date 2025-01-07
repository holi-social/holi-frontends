import React from 'react'

import NotFound from '@holi/core/screens/404/NotFound'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import SearchScreen from '@holi/core/screens/search/SearchScreen'
import UserProfile, { type UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useTheme } from '@holi/ui/styles/theme'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

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
      screenOptions={{ headerTintColor: colors.black300, headerShadowVisible: false }}
    >
      <FeedStack.Screen name={RouteName.HomeFeed} component={HomeFeed} />
      <FeedStack.Screen
        name={RouteName.Search}
        component={SearchScreen}
        options={{ headerLeft: () => <HeaderBackButton /> }}
      />
      <FeedStack.Screen name={RouteName.UserProfile} component={UserProfile} />
      <FeedStack.Screen name={RouteName.NotFound} component={NotFound} />
    </FeedStack.Navigator>
  )
}

export default FeedNavigator
