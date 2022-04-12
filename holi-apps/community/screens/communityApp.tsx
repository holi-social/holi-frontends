import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CommunityFeedScreen } from './communityFeed'
import { CommunityBoardScreen } from './communityBoard'

const CommunityBottomNav = createBottomTabNavigator()

const CommunityAppScreen: React.VoidFunctionComponent = () => {
  return (
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
}

export { CommunityAppScreen }
