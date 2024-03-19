import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import ChatBottomTabsNavigatorItem from '@holi/chat/src/components/ChatBottomTabsNavigatorItem'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import { setPathname } from '@holi/core/navigation/hooks/usePathname'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HomeSmile2, HomeSmile2Filled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import AuthStackNavigator from '@holi/mobile/navigation/AuthNavigator'
import ChatHomeStackNavigator from '@holi/mobile/navigation/ChatHomeNavigator'
import FeedNavigator from '@holi/mobile/navigation/FeedNavigator'
import SpacesHomeNavigator from '@holi/mobile/navigation/SpacesHomeNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

export type BottomTabsScreens = {
  [RouteName.Home]: undefined
  [RouteName.SpacesHomeStack]: undefined
  [RouteName.Chat]: undefined
  [RouteName.Auth]: undefined
}

const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()

const BottomTabsNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme

  const iconColor = (isActive: boolean) => (isActive ? colors.foreground30 : colors.foreground20)
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()

  return (
    <BottomTabs.Navigator
      initialRouteName={RouteName.Home}
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              height: dimensions.bottomBarMobile,
            },
            android: {
              height: dimensions.bottomBarHeight,
            },
          }),
          paddingTop: 6,
          backgroundColor: colors.background10,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.foreground20,
        },
        tabBarActiveTintColor: colors.foreground30,
        tabBarInactiveTintColor: colors.foreground20,
      }}
    >
      <BottomTabs.Screen
        name={RouteName.Home}
        component={FeedNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon={focused ? HomeSmile2Filled : HomeSmile2} color={iconColor(focused)} />
          },
          tabBarLabel: ({ focused }) => (
            <HoliText size="extrasmall" style={{ color: iconColor(focused) }}>
              {t('navigation.home')}
            </HoliText>
          ),
          tabBarLabelPosition: 'below-icon',
          tabBarTestID: 'btn-to-home-view',
        }}
        listeners={{ tabPress: () => setPathname('/') }}
      />
      <BottomTabs.Screen
        name={RouteName.SpacesHomeStack}
        component={SpacesHomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon={focused ? SpacesFilled : Spaces} color={iconColor(focused)} />
          },
          tabBarLabel: ({ focused }) => (
            <HoliText size="extrasmall" style={{ color: iconColor(focused) }}>
              {t('spaces.title')}
            </HoliText>
          ),
          tabBarLabelPosition: 'below-icon',
          tabBarTestID: 'btn-to-spaces',
        }}
        listeners={{ tabPress: () => setPathname('/spaces') }}
      />
      <BottomTabs.Screen
        name={RouteName.Chat}
        component={ChatHomeStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <ChatBottomTabsNavigatorItem focused={focused} />,
          tabBarLabel: ({ focused }) => (
            <HoliText size="extrasmall" style={{ color: iconColor(focused) }}>
              {t('chat.title')}
            </HoliText>
          ),
          tabBarLabelPosition: 'below-icon',
          tabBarTestID: 'btn-to-chat-view',
        }}
        listeners={{ tabPress: () => setPathname('/chat') }}
      />
      <BottomTabs.Screen
        name={RouteName.Auth}
        component={AuthStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: LoginProfileButton,
          tabBarLabel: ({ focused }) => (
            <HoliText
              size="extrasmall"
              style={{ color: iconColor(focused) }}
              testID={isLoggedIn ? 'user-logged-in' : 'user-not-logged-in'}
            >
              {isLoggedIn ? t('profile.title') : t('auth.login')}
            </HoliText>
          ),
          tabBarLabelPosition: 'below-icon',
          tabBarTestID: 'btn-to-profile-view',
        }}
        listeners={{ tabPress: () => setPathname('/profile') }}
      />
    </BottomTabs.Navigator>
  )
}

export default BottomTabsNavigator
