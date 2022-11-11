import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ForgotPassword from '@holi/core/auth/screens/ForgotPassword'
import Login from '@holi/core/auth/screens/Login'
import Logout from '@holi/core/auth/screens/Logout'
import Registration from '@holi/core/auth/screens/Registration'
import HeaderRight from '@holi/core/navigation/components/HeaderRight'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import Notifications from '@holi/core/screens/Notifications'
import Search from '@holi/core/screens/Search'
import CreatePostCommentPage, { CreatePostCommentPageParams } from '@holi/core/screens/comments/CreatePostCommentPage'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import InsightDetailPage, { InsightDetailPageParams } from '@holi/core/screens/insights/InsightDetailPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import AccountSettings from '@holi/core/screens/userprofile/AccountSettings'
import OwnProfile from '@holi/core/screens/userprofile/OwnProfile'
import SettingsOverview from '@holi/core/screens/userprofile/SettingsOverview'
import UserProfile, { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import DonationsAppNavigator from '@holi/mobile/navigation/DonationsAppNavigator'
import HeaderAnimated, { NativeStackNavigationCustomHeaderOptions } from '@holi/mobile/navigation/HeaderAnimated'
import SpacesNavigator from '@holi/mobile/navigation/SpacesNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

import {
  BackButton,
  CenterElement,
  DownButton,
  ItemRow,
  LeftElement,
  RightElement,
  TitleLeftElement,
} from './components'

export type HomeStackScreens = {
  AccountSettings: undefined
  HomeFeed: undefined
  InsightDetailPage: InsightDetailPageParams
  Notifications: undefined
  OwnProfile: undefined
  PostDetailPage: PostDetailPageParams
  CreatePostCommentPage: CreatePostCommentPageParams
  SettingsOverview: undefined
  Search: undefined
}

export type BottomTabsScreens = {
  Home: undefined
  Chat: undefined
  UserProfile: UserProfileParams
  Spaces: undefined
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
  const { navigate } = useRouting()
  const { t } = useTranslation()

  return (
    <HomeStack.Navigator
      initialRouteName="HomeFeed"
      screenOptions={{
        header: HeaderAnimated,
        headerShadowVisible: false,
      }}
    >
      <HomeStack.Screen
        name="HomeFeed"
        component={HomeFeed}
        options={{
          headerBackTitleVisible: true,
          headerBackVisible: true,
          headerTransparent: true,
          headerStyle: { backgroundColor: colors.backgroundColorWhite },
          headerTitle: () => null,
          headerLeft: TitleLeftElement,
          headerRight: ({ tintColor }) => (
            <ItemRow>
              <HoliButton
                label={t('notifications.title')}
                inline
                transparent
                onPress={() => navigate('/notifications')}
              >
                <HoliIcon icon="notification-2" size={24} color={tintColor} />
              </HoliButton>

              <HoliButton label={t('navigation.search')} inline transparent onPress={() => navigate('/search')}>
                <HoliIcon icon="search" size={24} color={tintColor} />
              </HoliButton>
            </ItemRow>
          ),
        }}
      />
      <HomeStack.Screen
        name="OwnProfile"
        component={OwnProfile}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
          headerRight: RightElement,
        }}
      />
      <HomeStack.Screen
        name="SettingsOverview"
        component={SettingsOverview}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
          headerRight: RightElement,
        }}
      />
      <HomeStack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
          headerRight: RightElement,
        }}
      />
      <HomeStack.Screen
        name="Search"
        component={Search}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
          headerRight: RightElement,
        }}
      />
      <HomeStack.Screen
        name="InsightDetailPage"
        component={InsightDetailPage}
        options={
          {
            headerTransparent: true,
            headerTintColor: colors.fontColorWhite,
            headerLeft: BackButton,
            headerCustomOptions: {
              headerBackgroundGradient: true,
            },
          } as NativeStackNavigationCustomHeaderOptions
        }
      />
      <HomeStack.Screen
        name="PostDetailPage"
        component={PostDetailPage}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
        }}
      />
      <HomeStack.Screen
        name="CreatePostCommentPage"
        component={CreatePostCommentPage}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
        }}
      />
      <HomeStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
          headerRight: RightElement,
        }}
      />
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
            ...(focusedRoute === 'PostDetailPage' || focusedRoute === 'CreatePostCommentPage'
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
          tabBarTestID: 'nav-button-home',
        }}
      />
      <BottomTabs.Screen
        name="Spaces"
        component={SpacesNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="loader" size={24} filled={focused} style={{ color: iconColor(focused) }} />
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
          headerStyle: {
            borderBottomColor: 'transparent',
          },
        }}
      />
      <BottomTabs.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          tabBarShowLabel: false,
          headerTitle: CenterElement,
          tabBarIcon: HeaderRight,
        }}
      />
    </BottomTabs.Navigator>
  )
}

const RootNavigator: React.VFC = () => {
  const { t } = useTranslation()

  return (
    <RootStack.Navigator
      initialRouteName="Core"
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="Core" component={BottomTabsNavigator} />
      <RootStack.Screen
        name="DonationsApp"
        component={DonationsAppNavigator}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerLeft: DownButton,
        }}
      />
      <RootStack.Screen name="VolunteeringApp" component={VolunteeringAppNavigator} />
      {/* modals are only correctly rendered on android when in root navigator */}
      <RootStack.Group
        screenOptions={{
          presentation: 'containedModal',
          animation: 'slide_from_bottom',
          headerShown: true,
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerLeft: DownButton,
        }}
      >
        <RootStack.Screen
          name="Login"
          component={Login}
          options={{
            title: t('auth.login'),
            headerLeft: LeftElement,
            headerRight: RightElement,
          }}
        />
        <RootStack.Screen
          name="Logout"
          component={Logout}
          options={{
            title: t('auth.logout'),
            headerLeft: LeftElement,
            headerRight: RightElement,
          }}
        />
        <RootStack.Screen
          name="Registration"
          component={Registration}
          options={{
            title: t('auth.register'),
            headerLeft: LeftElement,
            headerRight: RightElement,
          }}
        />
        <RootStack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            title: t('auth.forgotPassword'),
            headerLeft: LeftElement,
            headerRight: RightElement,
          }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default RootNavigator
