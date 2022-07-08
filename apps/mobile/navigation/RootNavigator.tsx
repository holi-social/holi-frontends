import React from 'react'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '@holi/core/auth/screens/Login'
import { Logout } from '@holi/core/auth/screens/Logout'
import HeaderNotificationLink from '@holi/core/navigation/components/HeaderNotificationLink'
import HeaderProfileLink from '@holi/core/navigation/components/HeaderProfileLink'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserProfileScreen } from '@holi/core/profile/UserProfileScreen'
import Explore from '@holi/core/screens/Explore'
import HomeFeed from '@holi/core/screens/HomeFeed'
import Notifications from '@holi/core/screens/Notifications'
import Quote, { QuoteParams } from '@holi/core/screens/Quote'
import Search from '@holi/core/screens/Search'
import Post, { PostParams } from '@holi/core/screens/topics/Post'
import Topic, { TopicParams } from '@holi/core/screens/topics/Topic'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import Holicon from '@holi/ui/components/holicon'
import { useTheme } from '@holi/ui/styles/theme/theme'

export type HomeStackScreens = {
  HomeFeed: undefined
  Topic: TopicParams
  Quote: QuoteParams
  Post: PostParams
  UserProfile: undefined
  Notifications: undefined
}

export type BottomTabsScreens = {
  Home: undefined
  Chat: undefined
  Explore: undefined
  Search: undefined
}

export type RootStackScreens = {
  Core: undefined
  VolunteeringApp: undefined
  Login: undefined
  Logout: undefined
}

const HomeStack = createNativeStackNavigator<HomeStackScreens>()
const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()
const RootStack = createNativeStackNavigator<RootStackScreens>()

const backButton = () => {
  const { theme } = useTheme()
  const { navigateBack } = useRouting()
  return (
    <HoliButton
      label="Go back"
      inline
      variant="transparent"
      onPress={() => navigateBack()}
      style={{ paddingHorizontal: 0 }}
    >
      <Holicon icon="arrow-back" size={30} color={theme.colors.softblack} />
    </HoliButton>
  )
}

const downButton = () => {
  const { theme } = useTheme()
  const { navigateBack } = useRouting()
  return (
    <HoliButton
      label="Close window"
      inline
      variant="transparent"
      onPress={() => navigateBack()}
      style={{ paddingHorizontal: 0 }}
    >
      <Holicon icon="arrowtip-down" size={30} color={theme.colors.softblack} />
    </HoliButton>
  )
}

export const HomeStackNavigator: React.VFC = () => {
  const { theme } = useTheme()
  return (
    <HomeStack.Navigator
      initialRouteName="HomeFeed"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.backgroundColorWhite,
        },
        headerTitleAlign: 'center',
      }}
    >
      <HomeStack.Screen
        name="HomeFeed"
        component={HomeFeed}
        options={{
          headerTitle: () => <HeaderTitle style={{ paddingTop: 5 }} />,
          headerLeft: () => <HeaderNotificationLink style={{ paddingHorizontal: 0, marginLeft: 5 }} />,
          headerRight: () => (
            <HeaderProfileLink
              style={{
                paddingHorizontal: 0,
                marginRight: 5,
              }}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: backButton,
          headerRight: () => (
            <HeaderProfileLink
              style={{
                paddingHorizontal: 0,
                marginRight: 5,
              }}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name="Topic"
        component={Topic}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: backButton,
        }}
      />
      <HomeStack.Screen
        name="Quote"
        component={Quote}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: backButton,
        }}
      />
      <HomeStack.Screen
        name="Post"
        component={Post}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: backButton,
        }}
      />
      <HomeStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: backButton,
          headerRight: () => (
            <HeaderProfileLink
              style={{
                paddingHorizontal: 0,
                marginRight: 5,
              }}
            />
          ),
        }}
      />
    </HomeStack.Navigator>
  )
}

export const BottomTabsNavigator: React.VFC = () => {
  const { theme } = useTheme()

  const iconColor = (isActive: boolean) => (isActive ? theme.colors.fontColorBlack : theme.colors.fontColorGrey)

  return (
    <BottomTabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundColorWhite,
          paddingHorizontal: 0,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.colors.fontColorGrey,
        },
      }}
    >
      <BottomTabs.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="home" size={20} filled={focused} style={{ color: iconColor(focused) }} />
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
            return <HoliIcon icon="chat" size={20} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Explore"
        component={Explore}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="explore" size={20} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="search" size={20} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
    </BottomTabs.Navigator>
  )
}

const RootNavigator: React.VFC = () => (
  <RootStack.Navigator
    initialRouteName="Core"
    screenOptions={{
      headerShown: false,
    }}
  >
    <RootStack.Screen name="Core" component={BottomTabsNavigator} />
    <RootStack.Screen name="VolunteeringApp" component={VolunteeringAppNavigator} />
    {/* modals are only correctly rendered on android when in root navigator */}
    <RootStack.Group
      screenOptions={{
        presentation: 'modal',
        animation: 'slide_from_bottom',
        headerShown: true,
        headerTitleAlign: 'center',
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerLeft: downButton,
      }}
    >
      <RootStack.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Login',
        }}
      />
      <RootStack.Screen
        name="Logout"
        component={Logout}
        options={{
          title: 'Logout',
        }}
      />
    </RootStack.Group>
  </RootStack.Navigator>
)

export default RootNavigator
