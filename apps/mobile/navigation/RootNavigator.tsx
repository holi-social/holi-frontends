import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import ForgotPassword from '@holi/core/auth/screens/ForgotPassword'
import Login from '@holi/core/auth/screens/Login'
import Logout from '@holi/core/auth/screens/Logout'
import Registration from '@holi/core/auth/screens/Registration'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import Notifications from '@holi/core/screens/Notifications'
import Search from '@holi/core/screens/Search'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import InsightDetailPage, { InsightDetailPageParams } from '@holi/core/screens/insights/InsightDetailPage'
import CommentInputPage, { CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import UserProfile, { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import AuthStackNavigator from '@holi/mobile/navigation/AuthNavigator'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import DonationsAppNavigator from '@holi/mobile/navigation/DonationsAppNavigator'
import GoodNewsAppNavigator from '@holi/mobile/navigation/GoodNewsAppNavigator'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'
import SpacesNavigator from '@holi/mobile/navigation/SpacesNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

export type HomeStackScreens = {
  [RouteName.HomeFeed]: undefined
  [RouteName.InsightDetailPage]: InsightDetailPageParams
  [RouteName.Notifications]: undefined
  [RouteName.PostDetailPage]: PostDetailPageParams
  [RouteName.CommentInputPage]: CommentInputPageParams
  [RouteName.Search]: undefined
  [RouteName.UserProfile]: UserProfileParams
}

export type BottomTabsScreens = {
  [RouteName.Home]: undefined
  [RouteName.Chat]: undefined
  [RouteName.Spaces]: undefined
  [RouteName.Auth]: undefined
}

export type RootStackScreens = {
  [RouteName.Core]: undefined
  [RouteName.DonationsApp]: undefined
  [RouteName.VolunteeringApp]: undefined
  [RouteName.GoodNewsApp]: undefined
  [RouteName.Login]: undefined
  [RouteName.Logout]: undefined
  [RouteName.Registration]: undefined
  [RouteName.ForgotPassword]: undefined
  [RouteName.Search]: undefined
}

const HomeStack = createNativeStackNavigator<HomeStackScreens>()
const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()
const RootStack = createNativeStackNavigator<RootStackScreens>()

export const HomeStackNavigator: React.VFC = () => {
  return (
    <HomeStack.Navigator
      initialRouteName={RouteName.HomeFeed}
      screenOptions={{
        header: HeaderAnimated,
        headerShadowVisible: false,
        headerTransparent: true,
      }}
    >
      <HomeStack.Screen name={RouteName.HomeFeed} component={HomeFeed} />
      <HomeStack.Screen name={RouteName.Search} component={Search} />
      <HomeStack.Screen name={RouteName.InsightDetailPage} component={InsightDetailPage} />
      <HomeStack.Screen name={RouteName.PostDetailPage} component={PostDetailPage} />
      <HomeStack.Screen name={RouteName.CommentInputPage} component={CommentInputPage} />
      <HomeStack.Screen name={RouteName.Notifications} component={Notifications} />
      <HomeStack.Screen name={RouteName.UserProfile} component={UserProfile} />
    </HomeStack.Navigator>
  )
}

export const BottomTabsNavigator: React.VFC = () => {
  const iconColor = (isActive: boolean) => (isActive ? colors.fontColorBlack : colors.fontColorGrey)
  const { t } = useTranslation()
  const { isLoggedIn } = useContext(AuthContext)

  return (
    <BottomTabs.Navigator
      initialRouteName={RouteName.Home}
      screenOptions={({ route }) => {
        const focusedRoute = getFocusedRouteNameFromRoute(route)

        return {
          tabBarStyle: {
            backgroundColor: colors.backgroundColorWhite,
            paddingHorizontal: 0,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.fontColorGrey,
            ...(focusedRoute === RouteName.InsightDetailPage ||
            focusedRoute === RouteName.PostDetailPage ||
            focusedRoute === RouteName.CommentInputPage
              ? { display: 'none' }
              : {}),
            tabBarShowLabel: true,
            tabBarLabelStyle: {
              color: 'black',
            },
          },
          tabBarActiveTintColor: colors.fontColorBlack,
          tabBarInactiveTintColor: colors.fontColorGrey,
        }
      }}
    >
      <BottomTabs.Screen
        name={RouteName.Home}
        component={HomeStackNavigator}
        options={{
          tabBarLabel: t('navigation.home'),
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="home-smile-2" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          tabBarTestID: 'btn-to-home-view',
        }}
      />
      <BottomTabs.Screen
        name={RouteName.Spaces}
        component={SpacesNavigator}
        options={{
          tabBarLabel: t('spaces.title'),
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="spaces" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          tabBarTestID: 'btn-to-spaces',
        }}
      />
      <BottomTabs.Screen
        name={RouteName.Chat}
        component={ChatStackNavigator}
        options={{
          tabBarLabel: t('chat.title'),
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="chat-3" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name={RouteName.Auth}
        component={AuthStackNavigator}
        options={{
          tabBarLabel: isLoggedIn ? t('profile.title') : t('auth.login'),
          headerShown: false,
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
      initialRouteName={RouteName.Core}
      screenOptions={{
        headerShown: false,
        header: HeaderAnimated,
        headerShadowVisible: false,
      }}
    >
      <RootStack.Screen name={RouteName.Core} component={BottomTabsNavigator} />
      <RootStack.Screen
        name={RouteName.DonationsApp}
        component={DonationsAppNavigator}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name={RouteName.GoodNewsApp}
        component={GoodNewsAppNavigator}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
      <RootStack.Screen name={RouteName.VolunteeringApp} component={VolunteeringAppNavigator} />
      {/* modals are only correctly rendered on android when in root navigator */}
      <RootStack.Group
        screenOptions={{
          presentation: 'containedModal',
          animation: 'slide_from_bottom',
          headerShown: true,
        }}
      >
        <RootStack.Screen name={RouteName.Login} component={Login} />
        <RootStack.Screen name={RouteName.Logout} component={Logout} />
        <RootStack.Screen name={RouteName.Registration} component={Registration} />
        <RootStack.Screen name={RouteName.ForgotPassword} component={ForgotPassword} />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default RootNavigator
