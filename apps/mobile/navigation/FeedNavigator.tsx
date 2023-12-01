import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import NotFound from '@holi/core/screens/404/NotFound'
import HomeFeedOnboarding from '@holi/core/screens/homeFeed/HomeFeedOnboarding'
import Search from '@holi/core/screens/search/Search'
import UserProfile, { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type FeedStackScreens = {
  [RouteName.HomeFeed]: undefined
  [RouteName.Search]: undefined
  [RouteName.NotFound]: undefined
  [RouteName.UserProfile]: UserProfileParams
}

const FeedStack = createNativeStackNavigator<FeedStackScreens>()

const FeedNavigator = () => {
  return (
    <FeedStack.Navigator
      initialRouteName={RouteName.HomeFeed}
      screenOptions={{
        header: HeaderAnimated,
        headerShadowVisible: false,
        headerTransparent: true,
      }}
    >
      <FeedStack.Screen name={RouteName.HomeFeed} component={HomeFeedOnboarding} />
      <FeedStack.Screen name={RouteName.Search} component={Search} />
      <FeedStack.Screen name={RouteName.UserProfile} component={UserProfile} />
      <FeedStack.Screen name={RouteName.NotFound} component={NotFound} />
    </FeedStack.Navigator>
  )
}

export default FeedNavigator
