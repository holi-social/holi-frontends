import React from 'react'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ForgotPassword from '@holi/core/auth/screens/ForgotPassword'
import Login from '@holi/core/auth/screens/Login'
import Logout from '@holi/core/auth/screens/Logout'
import Registration from '@holi/core/auth/screens/Registration'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import Notifications from '@holi/core/screens/Notifications'
import Search from '@holi/core/screens/Search'
import CreatePostCommentPage, { CreatePostCommentPageParams } from '@holi/core/screens/comments/CreatePostCommentPage'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import InsightDetailPage, { InsightDetailPageParams } from '@holi/core/screens/insights/InsightDetailPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import UserProfile, { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import AuthStackNavigator from '@holi/mobile/navigation/AuthNavigator'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import DonationsAppNavigator from '@holi/mobile/navigation/DonationsAppNavigator'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'
import SpacesNavigator from '@holi/mobile/navigation/SpacesNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

export type HomeStackScreens = {
  HomeFeed: undefined
  InsightDetailPage: InsightDetailPageParams
  Notifications: undefined
  PostDetailPage: PostDetailPageParams
  CreatePostCommentPage: CreatePostCommentPageParams
  Search: undefined
  UserProfile: UserProfileParams
}

export type BottomTabsScreens = {
  Home: undefined
  Chat: undefined
  Spaces: undefined
  Auth: undefined
}

export type RootStackScreens = {
  Core: undefined
  DonationsApp: undefined
  VolunteeringApp: undefined
  Login: undefined
  Logout: undefined
  Registration: undefined
  ForgotPassword: undefined
  Search: undefined
}

const HomeStack = createNativeStackNavigator<HomeStackScreens>()
const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()
const RootStack = createNativeStackNavigator<RootStackScreens>()

export const HomeStackNavigator: React.VFC = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeFeed"
      screenOptions={{
        header: HeaderAnimated,
        headerShadowVisible: false,
        headerTransparent: true,
      }}
    >
      <HomeStack.Screen name="HomeFeed" component={HomeFeed} />
      <HomeStack.Screen name="Search" component={Search} />
      <HomeStack.Screen name="InsightDetailPage" component={InsightDetailPage} />
      <HomeStack.Screen name="PostDetailPage" component={PostDetailPage} />
      <HomeStack.Screen name="CreatePostCommentPage" component={CreatePostCommentPage} />
      <HomeStack.Screen name="Notifications" component={Notifications} />
      <HomeStack.Screen name="UserProfile" component={UserProfile} />
    </HomeStack.Navigator>
  )
}

export const BottomTabsNavigator: React.VFC = () => {
  const iconColor = (isActive: boolean) => (isActive ? colors.fontColorBlack : colors.fontColorGrey)

  return (
    <BottomTabs.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const focusedRoute = getFocusedRouteNameFromRoute(route)

        return {
          tabBarStyle: {
            backgroundColor: colors.backgroundColorWhite,
            paddingHorizontal: 0,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.fontColorGrey,
            ...(focusedRoute === 'InsightDetailPage' ||
            focusedRoute === 'PostDetailPage' ||
            focusedRoute === 'CreatePostCommentPage'
              ? { display: 'none' }
              : {}),
          },
        }
      }}
    >
      <BottomTabs.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="home-smile-2" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          tabBarTestID: 'btn-to-home-view',
        }}
      />
      <BottomTabs.Screen
        name="Spaces"
        component={SpacesNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="spaces" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="chat-3" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Auth"
        component={AuthStackNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: LoginProfileButton,
          tabBarTestID: 'btn-to-profile-view',
        }}
      />
    </BottomTabs.Navigator>
  )
}

const RootNavigator: React.VFC = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Core"
      screenOptions={{
        headerShown: false,
        header: HeaderAnimated,
        headerShadowVisible: false,
      }}
    >
      <RootStack.Screen name="Core" component={BottomTabsNavigator} />
      <RootStack.Screen
        name="DonationsApp"
        component={DonationsAppNavigator}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
      <RootStack.Screen name="VolunteeringApp" component={VolunteeringAppNavigator} />
      {/* modals are only correctly rendered on android when in root navigator */}
      <RootStack.Group
        screenOptions={{
          presentation: 'containedModal',
          animation: 'slide_from_bottom',
          headerShown: true,
        }}
      >
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Logout" component={Logout} />
        <RootStack.Screen name="Registration" component={Registration} />
        <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default RootNavigator
