import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Search from '@holi/core/screens/Search'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import UserProfile, { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'
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
      <FeedStack.Screen name={RouteName.HomeFeed} component={HomeFeed} />
      <FeedStack.Screen name={RouteName.Search} component={Search} />
      <FeedStack.Screen name={RouteName.UserProfile} component={UserProfile} />
    </FeedStack.Navigator>
  )
}

export default FeedNavigator
