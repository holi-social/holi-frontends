import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import NotificationSettings from '@holi/core/screens/notifications/NotificationSettings'
import AboutHoliApp from '@holi/core/screens/userprofile/AboutHoliApp'
import AccountSettings from '@holi/core/screens/userprofile/AccountSettings'
import ChangeEmail from '@holi/core/screens/userprofile/ChangeEmail'
import ChangeEmailVerification from '@holi/core/screens/userprofile/ChangeEmailVerification'
import ChangePassword from '@holi/core/screens/userprofile/ChangePassword'
import Favorites from '@holi/core/screens/userprofile/Favorites'
import HelpSettings from '@holi/core/screens/userprofile/HelpSettings'
import LegalDocumentItem from '@holi/core/screens/userprofile/LegalDocumentItem'
import LegalDocuments from '@holi/core/screens/userprofile/LegalDocuments'
import OwnProfile from '@holi/core/screens/userprofile/OwnProfile'
import SettingsOverview from '@holi/core/screens/userprofile/SettingsOverview'
import TrackingSettings from '@holi/core/screens/userprofile/TrackingSettings'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'

export type AuthStackScreensList = {
  Profile: undefined
  SettingsOverview: undefined
  AccountSettings: undefined
  NotificationSettings: undefined
  TrackingSettings: undefined
  HelpSettings: undefined
  ChangePassword: undefined
  ChangeEmail: undefined
  ChangeEmailVerification: undefined
  LegalDocuments: undefined
  Document: undefined
  AboutHoliApp: undefined
  Favorites: undefined
}

const AuthStack = createNativeStackNavigator<AuthStackScreensList>()

const AuthStackNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme
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
        name={RouteName.NotificationSettings}
        component={NotificationSettings}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <AuthStack.Screen
        name={RouteName.TrackingSettings}
        component={TrackingSettings}
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
      <AuthStack.Screen
        name={RouteName.ChangeEmail}
        component={ChangeEmail}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <AuthStack.Screen
        name={RouteName.ChangeEmailVerification}
        component={ChangeEmailVerification}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <AuthStack.Screen
        name={RouteName.HelpSettings}
        component={HelpSettings}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <AuthStack.Screen
        name={RouteName.LegalDocuments}
        component={LegalDocuments}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <AuthStack.Screen
        name={RouteName.Document}
        component={LegalDocumentItem}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <AuthStack.Screen
        name={RouteName.AboutHoliApp}
        component={AboutHoliApp}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <AuthStack.Screen
        name={RouteName.Favorites}
        component={Favorites}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
    </AuthStack.Navigator>
  )
}

export default AuthStackNavigator
