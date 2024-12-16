import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NotFound from '@holi/core/screens/404/NotFound'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import Search from '@holi/core/screens/search/Search'
import UserProfile, { type UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'

export type FeedStackScreens = {
  [RouteName.HomeFeed]: undefined
  [RouteName.Search]: undefined
  [RouteName.NotFound]: undefined
  [RouteName.UserProfile]: UserProfileParams
}

const FeedStack = createNativeStackNavigator<FeedStackScreens>()

const FeedNavigator = () => {
  return (
    <FeedStack.Navigator initialRouteName={RouteName.HomeFeed} screenOptions={{ headerShadowVisible: false }}>
      <FeedStack.Screen name={RouteName.HomeFeed} component={HomeFeed} />
      <FeedStack.Screen
        name={RouteName.Search}
        component={Search}
        options={{ headerLeft: () => <HeaderBackButton /> }}
      />
      <FeedStack.Screen name={RouteName.UserProfile} component={UserProfile} />
      <FeedStack.Screen name={RouteName.NotFound} component={NotFound} />
    </FeedStack.Navigator>
  )
}

export default FeedNavigator
