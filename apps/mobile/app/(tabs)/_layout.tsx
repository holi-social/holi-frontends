import React, { useMemo } from 'react'
import { Tabs, usePathname } from 'expo-router'
import { View, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  HomeSmile2,
  HomeSmile2Filled,
  Megaphone,
  MegaphoneFilled,
  Spaces,
  SpacesFilled,
} from '@holi/icons/src/generated'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import { TextLink } from 'holi-bricks/components/text'
import { createStyleSheet } from 'holi-bricks/styles'
import { useBricks } from 'holi-bricks/foundations/colors/themes/useBricks'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Spacing } from 'holi-bricks/foundations'
import { BorderWidth } from 'holi-bricks/foundations/dimensions/borderWidth'
import ChatBottomTabsNavigatorItem from '@holi/chat/src/components/ChatBottomTabsNavigatorItem'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

const CustomTabBar = ({ navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets()
  const pathname = usePathname()
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()

  const TABS = useMemo(
    () => [
      {
        name: 'index',
        icon: HomeSmile2,
        iconFilled: HomeSmile2Filled,
        label: 'navigation.home',
        testID: 'btn-to-home-view',
      },
      {
        name: 'act',
        icon: Megaphone,
        iconFilled: MegaphoneFilled,
        label: t('navigation.act'),
        testID: 'btn-to-act',
      },
      {
        name: 'spaces',
        icon: Spaces,
        iconFilled: SpacesFilled,
        label: t('navigation.organize'),
        testID: 'btn-to-spaces',
      },
      {
        name: 'chat',
        custom: 'chat',
        label: t('navigation.chat'),
        testID: 'btn-to-chat-view',
      },
      {
        name: 'profile',
        custom: 'profile',
        label: isLoggedIn ? t('navigation.profile') : t('navigation.login'),
        testID: isLoggedIn ? 'btn-to-profile-view' : 'btn-to-anonymous-profile-view',
      },
    ],
    [isLoggedIn, t]
  )
  return (
    <View style={styles.tabBar(insets.bottom)}>
      {TABS.map(
        /**
         * Renders a navigation tab item for a bottom tab navigator.
         * The appearance and behavior of the tab item depends on the tab configuration
         * and whether the tab is currently active (focused).
         *
         * @callback tab
         * @param {Object} tab - Object representing the tab configuration.
         * @param {string} tab.name - The name of the tab, used for navigation and identification.
         * @param {string} tab.label - The localization key for the tab label.
         * @param {string} [tab.custom] - Optional property to define custom behavior or components (e.g., "chat" or "profile").
         * @param {string} [tab.icon] - The icon used when the tab is not focused.
         * @param {string} [tab.iconFilled] - The icon used when the tab is focused.
         * @param {string} tab.testID - A test identifier for the tab element.
         * @returns {JSX.Element} A Pressable component representing a navigation tab.
         */
        (tab) => {
          const isFocused = pathname === `/${tab.name}`
          const label = t(tab.label)
          const onPress = () => navigation.navigate(tab.name)

          const icon = () => {
            if (tab.custom === 'chat') {
              return <ChatBottomTabsNavigatorItem focused={isFocused} />
            }
            if (tab.custom === 'profile') {
              return <LoginProfileButton />
            }
            const Icon = (isFocused ? tab.iconFilled : tab.icon) as HoliIconType
            return <HoliIcon icon={Icon} colorOverride={styles.icon(isFocused).color} />
          }

          return (
            <Pressable key={tab.name} onPress={onPress} testID={tab.testID} style={styles.tabItem}>
              {icon()}
              <TextLink size="xs" color={isFocused ? 'main' : 'default'}>
                {label}
              </TextLink>
            </Pressable>
          )
        }
      )}
    </View>
  )
}

export default function Layout() {
  const { theme } = useBricks()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: theme.colors.fill.default,
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderBackButton />,
        headerStyle: {
          backgroundColor: theme.colors.bg.support,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name={RouteName.TabHome} options={{ headerShown: true }} />
      <Tabs.Screen name={RouteName.TabAct} options={{ headerShown: true }} />
      <Tabs.Screen name={RouteName.TabSpaces} options={{ headerShown: true }} />
      <Tabs.Screen name={RouteName.TabChat} options={{ headerShown: true }} />
      <Tabs.Screen name={RouteName.TabAuth} options={{ headerShown: true }} />
    </Tabs>
  )
}

const styles = createStyleSheet((theme) => ({
  tabBar: (inset: number) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingTop: Spacing['3xs'],
    paddingBottom: inset + Spacing['3xs'],
    height: dimensions.bottomBarHeight + inset,
    backgroundColor: 'transparent',
    borderTopWidth: BorderWidth.sm,
    borderTopColor: theme.colors.border.default,
  }),
  tabItem: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
  },
  icon: (focused: boolean) => ({
    color: focused ? theme.colors.fill.main : theme.colors.fill.default,
  }),
}))
