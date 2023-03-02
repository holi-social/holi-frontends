import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Search from '@holi/core/screens/Search'
import HomeFeedOnboarding from '@holi/core/screens/homeFeed/HomeFeedOnboarding'
import UserProfile, { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type FeedStackScreens = {
  [RouteName.HomeFeed]: undefined
  [RouteName.Search]: undefined
  [RouteName.UserProfile]: UserProfileParams
}

const FeedStack = createNativeStackNavigator<FeedStackScreens>()

const FeedNavigator: React.VFC = () => {
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
    </FeedStack.Navigator>
  )
}

export default FeedNavigator
