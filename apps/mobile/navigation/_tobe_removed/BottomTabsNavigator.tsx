import { StyleSheet } from 'react-native-unistyles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import ChatBottomTabsNavigatorItem from '@holi/chat/src/components/ChatBottomTabsNavigatorItem'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import { setPathname } from '@holi/core/navigation/hooks/usePathname'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Home, HomeFilled, Megaphone, MegaphoneFilled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import ActNavigator from '@holi/mobile/navigation/_tobe_removed/ActNavigator'
import AuthStackNavigator from '@holi/mobile/navigation/_tobe_removed/AuthNavigator'
import ChatHomeStackNavigator from '@holi/mobile/navigation/_tobe_removed/ChatHomeNavigator'
import FeedNavigator from '@holi/mobile/navigation/_tobe_removed/FeedNavigator'
import SpacesHomeNavigator from '@holi/mobile/navigation/_tobe_removed/SpacesHomeNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useBricks } from 'holi-bricks/foundations/colors/themes/useBricks'
import { TextLink } from 'holi-bricks/components/text'

export type BottomTabsScreens = {
  [RouteName.Home]: undefined
  [RouteName.SpacesStack]: undefined
  [RouteName.ActStack]: undefined
  [RouteName.Chat]: undefined
  [RouteName.Auth]: undefined
}

const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()

const BottomTabLabel = ({ label, focused }: { label: string; focused: boolean }) => {
  return (
    <HoliBox padding={[0, 0, 4, 0]}>
      <TextLink size="xs" color={focused ? 'main' : 'default'}>
        {label}
      </TextLink>
    </HoliBox>
  )
}

const BottomTabsNavigator = () => {
  const { theme } = useBricks()

  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  return (
    <BottomTabs.Navigator
      initialRouteName={RouteName.Home}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.fill.main,
        tabBarInactiveTintColor: theme.colors.fill.muted,
      }}
    >
      <BottomTabs.Screen
        name={RouteName.Home}
        component={FeedNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon={focused ? HomeFilled : Home} colorOverride={styles.icon(focused).color} />
          },
          tabBarLabel: ({ focused }) => <BottomTabLabel label={t('navigation.feed', 'Feed')} focused={focused} />,
          tabBarLabelPosition: 'below-icon',
          tabBarButtonTestID: 'btn-to-home-view',
        }}
        listeners={{ tabPress: () => setPathname('/') }}
      />

      <BottomTabs.Screen
        name={RouteName.ActStack}
        component={ActNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <HoliIcon icon={focused ? MegaphoneFilled : Megaphone} colorOverride={styles.icon(focused).color} />
          ),
          tabBarLabel: ({ focused }) => <BottomTabLabel label={t('navigation.act', 'Act')} focused={focused} />,
          tabBarLabelPosition: 'below-icon',
          tabBarButtonTestID: 'btn-to-act',
        }}
        listeners={{ tabPress: () => setPathname('/act') }}
      />

      <BottomTabs.Screen
        name={RouteName.SpacesStack}
        component={SpacesHomeNavigator}
        options={{
          headerShown: false,
          headerTitle: () => null,
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon={focused ? SpacesFilled : Spaces} colorOverride={styles.icon(focused).color} />
          },
          tabBarLabel: ({ focused }) => <BottomTabLabel label={t('navigation.organize')} focused={focused} />,
          tabBarLabelPosition: 'below-icon',
          tabBarButtonTestID: 'btn-to-spaces',
        }}
        listeners={{ tabPress: () => setPathname('/spaces') }}
      />

      <BottomTabs.Screen
        name={RouteName.Chat}
        component={ChatHomeStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <ChatBottomTabsNavigatorItem focused={focused} />,
          tabBarLabel: ({ focused }) => <BottomTabLabel label={t('navigation.chat')} focused={focused} />,
          tabBarLabelPosition: 'below-icon',
          // tabBarTestID: 'btn-to-chat-view',
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
            <BottomTabLabel label={isLoggedIn ? t('navigation.profile') : t('navigation.login')} focused={focused} />
          ),
          tabBarLabelPosition: 'below-icon',
          tabBarButtonTestID: isLoggedIn ? 'btn-to-profile-view' : 'btn-to-anonymous-profile-view',
        }}
        listeners={{ tabPress: () => setPathname('/profile') }}
      />
    </BottomTabs.Navigator>
  )
}

export default BottomTabsNavigator

const styles = StyleSheet.create((theme) => ({
  tabBar: {
    paddingTop: 4,
    /**
     * insets.bottom are the iOS bottom bar (usually on newer devices).
     * Older devices don't have them, and setting a single tab bar height for all leads to unnecessarily large bottom tabs on older iOS devices.
     */
    height: dimensions.bottomBarHeight,
    backgroundColor: theme.colors.bg.main,
    borderTopWidth: 1,
    borderTopColor: theme.colors.bg.main,
  },
  icon: (focused: boolean) => ({
    color: focused ? theme.colors.fill.main : theme.colors.fill.default,
  }),
}))
