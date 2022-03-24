import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import useRouting from 'shared/components/navigation/useRouting'
import { CustomHeaderIconButton } from 'shared/features/community/components/custom-header-icon-button'
import { CommunityScreen } from 'shared/features/community/screens/home'
import { BoardScreen } from 'shared/features/community/screens/board'

const CommunityBottomNav = createBottomTabNavigator()

export const CommunityApp: React.VoidFunctionComponent = () => {
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
        component={CommunityScreen}
      />
      <CommunityBottomNav.Screen name="Board" component={BoardScreen} />
    </CommunityBottomNav.Navigator>
  )
}
