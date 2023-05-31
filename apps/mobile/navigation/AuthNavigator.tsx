import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AccountSettings from '@holi/core/screens/userprofile/AccountSettings'
import ChangePassword from '@holi/core/screens/userprofile/ChangePassword'
import OwnProfile from '@holi/core/screens/userprofile/OwnProfile'
import SettingsOverview from '@holi/core/screens/userprofile/SettingsOverview'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type AuthStackScreensList = {
  Profile: undefined
  SettingsOverview: undefined
  AccountSettings: undefined
  ChangePassword: undefined
}

const AuthStack = createNativeStackNavigator<AuthStackScreensList>()

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName={RouteName.Profile}
      screenOptions={{
        header: (props) => <HeaderAnimated {...props} />,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.background10,
        },
      }}
    >
      <AuthStack.Screen name={RouteName.Profile} component={OwnProfile} options={{ headerShown: false }} />
      <AuthStack.Screen
        name={RouteName.SettingsOverview}
        component={SettingsOverview}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <AuthStack.Screen
        name={RouteName.AccountSettings}
        component={AccountSettings}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <AuthStack.Screen
        name={RouteName.ChangePassword}
        component={ChangePassword}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
    </AuthStack.Navigator>
  )
}

export default AuthStackNavigator
