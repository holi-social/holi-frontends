import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import useRouting from '@holi/ui/components/navigation/useRouting'
import { CustomHeaderIconButton } from '@holi-apps/community/components/custom-header-icon-button'
import { CommunityFeedScreen } from './communityFeed'
import { CommunityBoardScreen } from './communityBoard'

const CommunityBottomNav = createBottomTabNavigator()

const CommunityAppScreen: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
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
