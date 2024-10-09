import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import ChatBottomTabsNavigatorItem from '@holi/chat/src/components/ChatBottomTabsNavigatorItem'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import { setPathname } from '@holi/core/navigation/hooks/usePathname'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  HomeSmile2,
  HomeSmile2Filled,
  Megaphone,
  MegaphoneFilled,
  Spaces,
  SpacesFilled,
} from '@holi/icons/src/generated'
import ActNavigator from '@holi/mobile/navigation/ActNavigator'
import AuthStackNavigator from '@holi/mobile/navigation/AuthNavigator'
import ChatHomeStackNavigator from '@holi/mobile/navigation/ChatHomeNavigator'
import FeedNavigator from '@holi/mobile/navigation/FeedNavigator'
import SpacesHomeNavigator from '@holi/mobile/navigation/SpacesHomeNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type BottomTabsScreens = {
  [RouteName.Home]: undefined
  [RouteName.SpacesStack]: undefined
  [RouteName.ActStack]: undefined
  [RouteName.Chat]: undefined
  [RouteName.Auth]: undefined
}

const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()

const BottomTabsNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme
  const insets = useSafeAreaInsets()

  const iconColor = (isActive: boolean) => (isActive ? colors.foreground30 : colors.foreground20)
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const styles = useMemo(() => getStyles(theme, insets), [theme, insets])

  return (
    <BottomTabs.Navigator
      initialRouteName={RouteName.Home}
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
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
            <HoliText size="extrasmall" style={[{ color: iconColor(focused) }, styles.label]}>
              {t('navigation.home')}
            </HoliText>
          ),
          tabBarLabelPosition: 'below-icon',
          tabBarTestID: 'btn-to-home-view',
        }}
        listeners={{ tabPress: () => setPathname('/') }}
      />
      <BottomTabs.Screen
        name={RouteName.SpacesStack}
        component={SpacesHomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon={focused ? SpacesFilled : Spaces} color={iconColor(focused)} />
          },
          tabBarLabel: ({ focused }) => (
            <HoliText size="extrasmall" style={[{ color: iconColor(focused) }, styles.label]}>
              {t('navigation.spaces')}
            </HoliText>
          ),
          tabBarLabelPosition: 'below-icon',
          tabBarTestID: 'btn-to-spaces',
        }}
        listeners={{ tabPress: () => setPathname('/spaces') }}
      />
      <BottomTabs.Screen
        name={RouteName.ActStack}
        component={ActNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <HoliIcon icon={focused ? MegaphoneFilled : Megaphone} color={iconColor(focused)} />
          ),
          tabBarLabel: ({ focused }) => (
            <HoliText size="extrasmall" style={[{ color: iconColor(focused) }, styles.label]}>
              {t('navigation.act')}
            </HoliText>
          ),
          tabBarLabelPosition: 'below-icon',
          tabBarTestID: 'btn-to-act',
        }}
        listeners={{ tabPress: () => setPathname('/act') }}
      />
      <BottomTabs.Screen
        name={RouteName.Chat}
        component={ChatHomeStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <ChatBottomTabsNavigatorItem focused={focused} />,
          tabBarLabel: ({ focused }) => (
            <HoliText size="extrasmall" style={[{ color: iconColor(focused) }, styles.label]}>
              {t('navigation.chat')}
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
              style={[{ color: iconColor(focused) }, styles.label]}
              testID={isLoggedIn ? 'user-logged-in' : 'user-not-logged-in'}
            >
              {isLoggedIn ? t('navigation.profile') : t('navigation.login')}
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

const getStyles = (theme: HoliTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    tabBar: {
      paddingTop: 4,
      /**
       * insets.bottom are the iOS bottom bar (usually on newer devices).
       * Older devices don't have them, and setting a single tab bar height for all leads to unnecessarily large bottom tabs on older iOS devices.
       */
      height: dimensions.bottomBarHeight + insets.bottom,
      backgroundColor: theme.colors.background10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.foreground20,
    },
    label: {
      paddingBottom: 4,
    },
  })
