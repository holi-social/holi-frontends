import React from 'react'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '@holi/core/auth/screens/Login'
import { Logout } from '@holi/core/auth/screens/Logout'
import { ExploreScreen } from '@holi/core/explore/ExploreScreen'
import { HomeFeedScreen } from '@holi/core/home/HomeFeedScreen'
import HeaderNotificationLink from '@holi/core/navigation/components/HeaderNotificationLink'
import HeaderProfileLink from '@holi/core/navigation/components/HeaderProfileLink'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { NotificationsScreen } from '@holi/core/notifications/NotificationsScreen'
import { UserProfileScreen } from '@holi/core/profile/UserProfileScreen'
import { SearchScreen } from '@holi/core/search/SearchScreen'
import { TopicEditorsScreen, TopicEditorsScreenParams } from '@holi/core/topics/TopicEditorsScreen'
import { TopicScreenParams, TopicsScreen } from '@holi/core/topics/TopicsScreen'
import { PostScreen, PostScreenParams } from '@holi/core/topics/posts/PostScreen'
import ChatStackNavigator from '@holi/mobile/navigation/chatNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/volunteeringAppNavigator'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import Holicon from '@holi/ui/components/holicon'
import { useTheme } from '@holi/ui/styles/theme/theme'

export type HomeStackScreens = {
  HomeFeed: undefined
  Topic: TopicScreenParams
  Post: PostScreenParams
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
  TopicEditorsScreen: TopicEditorsScreenParams
}

const HomeStack = createNativeStackNavigator<HomeStackScreens>()
const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()
const RootStack = createNativeStackNavigator<RootStackScreens>()

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
        component={HomeFeedScreen}
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
          headerLeft: () => {
            const { navigate } = useRouting()
            return (
              <HoliButton
                label="Notifications"
                inline
                transparent
                onPress={() => navigate('/')}
                style={{ paddingHorizontal: 0 }}
              >
                <Holicon icon="arrow-back" size={30} color={theme.colors.positivepurple} />
              </HoliButton>
            )
          },
        }}
      />
      <HomeStack.Screen
        name="Topic"
        component={TopicsScreen}
        options={{
          headerLeft: () => {
            const { navigate } = useRouting()
            return (
              <HoliButton
                label="Notifications"
                inline
                transparent
                onPress={() => navigate('/')}
                style={{ paddingHorizontal: 0 }}
              >
                <Holicon icon="arrow-back" size={30} color={theme.colors.positivepurple} />
              </HoliButton>
            )
          },
        }}
      />
      <HomeStack.Screen name="Post" component={PostScreen} />
      <HomeStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerLeft: () => {
            const { navigate } = useRouting()
            return (
              <HoliButton
                label="Notifications"
                inline
                transparent
                onPress={() => navigate('/')}
                style={{ paddingHorizontal: 0 }}
              >
                <Holicon icon="arrow-back" size={30} color={theme.colors.positivepurple} />
              </HoliButton>
            )
          },
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
          headerShown: false, // each page sets it's own header, see HomeStackNavigator
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="home" size={20} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Chat"
        component={ChatStackNavigator} // chat is complex, probably needs a navigator
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
        component={ExploreScreen}
        options={{
          headerShown: true, // TODO: replace with custom header
          headerTitleAlign: 'center',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="explore" size={20} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: true, // TODO: replace with custom header
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

export const RootNavigator: React.VFC = () => (
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
      <RootStack.Screen
        name="TopicEditorsScreen"
        component={TopicEditorsScreen}
        options={{
          title: 'Topic Editors',
        }}
      />
    </RootStack.Group>
  </RootStack.Navigator>
)
