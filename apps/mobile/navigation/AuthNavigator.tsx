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
import { RouteName } from '@holi/mobile/navigation/routeName'

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
  return (
    <AuthStack.Navigator
      initialRouteName={RouteName.Profile}
      screenOptions={{ headerShown: true, headerShadowVisible: false, headerTitleAlign: 'center' }}
    >
      <AuthStack.Screen name={RouteName.Profile} component={OwnProfile} />
      <AuthStack.Screen name={RouteName.SettingsOverview} component={SettingsOverview} />
      <AuthStack.Screen name={RouteName.AccountSettings} component={AccountSettings} />
      <AuthStack.Screen name={RouteName.NotificationSettings} component={NotificationSettings} />
      <AuthStack.Screen name={RouteName.TrackingSettings} component={TrackingSettings} />
      <AuthStack.Screen name={RouteName.ChangePassword} component={ChangePassword} />
      <AuthStack.Screen name={RouteName.ChangeEmail} component={ChangeEmail} />
      <AuthStack.Screen name={RouteName.ChangeEmailVerification} component={ChangeEmailVerification} />
      <AuthStack.Screen name={RouteName.HelpSettings} component={HelpSettings} />
      <AuthStack.Screen name={RouteName.LegalDocuments} component={LegalDocuments} />
      <AuthStack.Screen name={RouteName.Document} component={LegalDocumentItem} />
      <AuthStack.Screen name={RouteName.AboutHoliApp} component={AboutHoliApp} />
      <AuthStack.Screen name={RouteName.Favorites} component={Favorites} />
    </AuthStack.Navigator>
  )
}

export default AuthStackNavigator
