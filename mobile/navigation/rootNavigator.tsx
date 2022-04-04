import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CommunityAppScreen } from 'shared/features/community/screens/communityApp'
import { CommunityFeedDetailScreen } from 'shared/features/community/screens/communityFeedDetail'
import { Login } from 'shared/features/authentication/screens/Login'
import { Logout } from 'shared/features/authentication/screens/Logout'
import { Registration } from 'shared/features/authentication/screens/Registration'
import SpacesNavigator from 'mobile/navigation/spacesNavigator'

export type RootStackScreensList = {
  Spaces: undefined
  Login: undefined
  Logout: undefined
  Registration: undefined
  Community: undefined
  CommunityFeedDetail: {
    feedId: string
  }
}

const RootStack = createNativeStackNavigator<RootStackScreensList>()

export const RootNavigator: React.ComponentType = () => (
  <RootStack.Navigator
    initialRouteName="Spaces"
    screenOptions={{
      headerShown: false,
    }}
  >
    <RootStack.Screen name="Spaces" component={SpacesNavigator} />
    <RootStack.Screen name="Login" component={Login} />
    <RootStack.Screen name="Logout" component={Logout} />
    <RootStack.Screen name="Registration" component={Registration} />
    <RootStack.Screen
      name="Community"
      component={CommunityAppScreen}
      options={{
        animation: 'slide_from_bottom',
        gestureEnabled: false,
      }}
    />
    {/* modals are only correctly rendered on android when in root navigator */}
    <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: true }}>
      <RootStack.Screen name="CommunityFeedDetail" component={CommunityFeedDetailScreen} />
    </RootStack.Group>
  </RootStack.Navigator>
)
