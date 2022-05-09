import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '@holi/core/auth/screens/Login'
import { Logout } from '@holi/core/auth/screens/Logout'
import { Registration } from '@holi/core/auth/screens/Registration'
import { UserProfileScreen } from '@holi/core/spaces/screens/userProfile'

import { CommunityAppScreen } from '@holi-apps/community/screens/communityApp'

import SpacesNavigator from './spacesNavigator'

export type RootStackScreensList = {
  Spaces: undefined
  Community: undefined
  Login: undefined
  Logout: undefined
  Registration: undefined
  UserProfile: undefined
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
    <RootStack.Screen
      name="Community"
      component={CommunityAppScreen}
      options={{
        animation: 'slide_from_bottom',
        gestureEnabled: false,
      }}
    />
    {/* modals are only correctly rendered on android when in root navigator */}
    <RootStack.Group
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}
    ></RootStack.Group>
    <RootStack.Screen name="Login" component={Login} />
    <RootStack.Screen name="Logout" component={Logout} />
    <RootStack.Screen name="Registration" component={Registration} />
    <RootStack.Screen name="UserProfile" component={UserProfileScreen} />
  </RootStack.Navigator>
)
