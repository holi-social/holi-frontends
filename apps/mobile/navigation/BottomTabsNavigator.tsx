import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import AuthStackNavigator from '@holi/mobile/navigation/AuthNavigator'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import FeedNavigator from '@holi/mobile/navigation/FeedNavigator'
import SpacesHomeNavigator from '@holi/mobile/navigation/SpacesHomeNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

export type BottomTabsScreens = {
  [RouteName.Home]: undefined
  [RouteName.SpacesHomeStack]: undefined
  [RouteName.Chat]: undefined
  [RouteName.Auth]: undefined
}

const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()

const BottomTabsNavigator: React.VFC = () => {
  const { options } = useUnifiedNavigation()
  const iconColor = (isActive: boolean) => (isActive ? colors.foreground30 : colors.foreground20)
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()

  return (
    <BottomTabs.Navigator
      initialRouteName={RouteName.Home}
      screenOptions={() => {
        return {
          tabBarStyle: {
            backgroundColor: colors.background10,
            paddingHorizontal: 0,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.foreground20,
            ...(options.navigationCustomOptions?.footerShown === false ? { display: 'none', maxHeight: 0 } : {}),
            tabBarShowLabel: true,
            tabBarLabelStyle: {
              color: 'black',
            },
          },
          tabBarActiveTintColor: colors.foreground30,
          tabBarInactiveTintColor: colors.foreground20,
        }
      }}
    >
      <BottomTabs.Screen
        name={RouteName.Home}
        component={FeedNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="home-smile-2" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          tabBarLabel: 'Home',
          tabBarTestID: 'btn-to-home-view',
        }}
      />
      <BottomTabs.Screen
        name={RouteName.SpacesHomeStack}
        component={SpacesHomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="spaces" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          tabBarLabel: t('spaces.title'),
          tabBarTestID: 'btn-to-spaces',
        }}
      />
      <BottomTabs.Screen
        name={RouteName.Chat}
        component={ChatStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="chat-3" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          tabBarLabel: 'Chat',
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

export default BottomTabsNavigator
