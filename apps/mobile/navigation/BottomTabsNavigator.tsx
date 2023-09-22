import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import { setPathname } from '@holi/core/navigation/hooks/usePathname'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Chat3, Chat3Filled, HomeSmile2, HomeSmile2Filled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import AuthStackNavigator from '@holi/mobile/navigation/AuthNavigator'
import ChatHomeStackNavigator from '@holi/mobile/navigation/ChatHomeNavigator'
import FeedNavigator from '@holi/mobile/navigation/FeedNavigator'
import SpacesHomeNavigator from '@holi/mobile/navigation/SpacesHomeNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export type BottomTabsScreens = {
  [RouteName.Home]: undefined
  [RouteName.SpacesHomeStack]: undefined
  [RouteName.Chat]: undefined
  [RouteName.Auth]: undefined
}

const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()

const BottomTabsNavigator = () => {
  const iconColor = (isActive: boolean) => (isActive ? colors.foreground30 : colors.foreground20)
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()

  return (
    <BottomTabs.Navigator
      initialRouteName={RouteName.Home}
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.background10,
          paddingHorizontal: 0,
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
              Home
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
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon={focused ? Chat3Filled : Chat3} color={iconColor(focused)} />
          },
          tabBarLabel: ({ focused }) => (
            <HoliText size="extrasmall" style={{ color: iconColor(focused) }}>
              Chat
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
