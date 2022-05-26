import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { CommunityBoardScreen } from './communityBoard'
import { CommunityFeedScreen } from './communityFeed'

const CommunityBottomNav = createBottomTabNavigator()

const CommunityAppScreen: React.VoidFunctionComponent = () => (
  <CommunityBottomNav.Navigator
    initialRouteName="CommunityHome"
    screenOptions={{
      headerShown: false,
    }}
  >
    <CommunityBottomNav.Screen
      name="CommunityHome"
      options={{
        tabBarBadge: 3,
      }}
      component={CommunityFeedScreen}
    />
    <CommunityBottomNav.Screen name="CommunityBoard" component={CommunityBoardScreen} />
  </CommunityBottomNav.Navigator>
)

export { CommunityAppScreen }
