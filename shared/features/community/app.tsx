import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import useRouting from 'shared/navigation/useRouting'
import { CustomHeaderIconButton } from 'shared/navigation/custom-header-icon-button'

import { CommunityScreen } from 'shared/features/community/home'
import { BoardScreen } from 'shared/features/community/board'

const CommunityBottomNav = createBottomTabNavigator()

export const CommunityApp: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  return (
    <CommunityBottomNav.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerLeft: () => <CustomHeaderIconButton onPress={() => navigate('/')} />,
      }}
    >
      <CommunityBottomNav.Screen
        name="Home"
        options={{
          tabBarBadge: 3,
        }}
        component={CommunityScreen}
      />
      <CommunityBottomNav.Screen name="Board" component={BoardScreen} />
    </CommunityBottomNav.Navigator>
  )
}
