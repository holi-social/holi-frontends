import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import useRouting from '../../navigation/useRouting'
import { CustomHeaderIconButton } from '../../navigation/custom-header-icon-button'
import { RootStackScreensList } from '../../navigation/native'

import { CommunityScreen } from './home'
import { BoardScreen } from './board'

const CommunityBottomNav = createBottomTabNavigator()

type CommunityAppProps = NativeStackScreenProps<RootStackScreensList, 'Community'>

export const CommunityApp: React.VoidFunctionComponent<CommunityAppProps> = () => {
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
