import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import useRouting from 'shared/components/navigation/useRouting'
import { CustomHeaderIconButton } from 'shared/features/community/components/custom-header-icon-button'
import { CommunityFeedScreen } from './communityFeed'
import { CommunityBoardScreen } from './communityBoard'

const CommunityBottomNav = createBottomTabNavigator()

const CommunityAppScreen: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  return (
    <CommunityBottomNav.Navigator
      initialRouteName="CommunityHome"
      screenOptions={{
        headerShown: true,
        headerLeft: () => <CustomHeaderIconButton onPress={() => navigate('/')} />,
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
