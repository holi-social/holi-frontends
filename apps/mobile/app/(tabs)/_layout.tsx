import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  AccountCircle,
  AccountCircleFilled,
  Chat3,
  Chat3Filled,
  HomeSmile2,
  HomeSmile2Filled,
  Megaphone,
  MegaphoneFilled,
  Spaces,
  SpacesFilled,
} from '@holi/icons/src/generated'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useBricks } from 'holi-bricks/foundations/colors/themes/useBricks'
import { Tabs } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from 'holi-bricks/components/avatar'

export default function Layout() {
  const { theme } = useBricks()
  const { t } = useTranslation()
  const { isLoggedIn, user } = useLoggedInUser()

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: theme.colors.fill.default,
        tabBarActiveTintColor: theme.colors.fill.main,
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: theme.colors.fill.default,
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderBackButton />,
        headerStyle: {
          backgroundColor: theme.colors.bg.support,
        },
      }}
    >
      <Tabs.Screen
        name={RouteName.TabHome}
        options={{
          tabBarButtonTestID: 'btn-to-home-view',
          tabBarLabel: t('navigation.home'),
          headerShown: true,
          tabBarIcon: ({ focused, color }) => {
            return <HoliIcon icon={focused ? HomeSmile2Filled : HomeSmile2} colorOverride={color} />
          },
        }}
      />
      <Tabs.Screen
        name={RouteName.TabAct}
        options={{
          tabBarLabel: t('navigation.act'),
          tabBarButtonTestID: 'btn-to-act',
          headerShown: true,
          tabBarIcon: ({ focused, color }) => {
            return <HoliIcon icon={focused ? MegaphoneFilled : Megaphone} colorOverride={color} />
          },
        }}
      />
      <Tabs.Screen
        name={RouteName.TabSpaces}
        options={{
          tabBarLabel: t('navigation.organize'),
          tabBarButtonTestID: 'btn-to-spaces',
          headerShown: true,
          tabBarIcon: ({ focused, color }) => {
            return <HoliIcon icon={focused ? Spaces : SpacesFilled} colorOverride={color} />
          },
        }}
      />

      <Tabs.Screen
        name={RouteName.TabChat}
        options={{
          tabBarButtonTestID: 'btn-to-chat-view',
          headerShown: true,
          tabBarLabel: t('navigation.chat'),
          tabBarIcon: ({ focused, color }) => {
            return <HoliIcon icon={focused ? Chat3Filled : Chat3} colorOverride={color} />
          },
        }}
      />

      <Tabs.Screen
        name={RouteName.TabAuth}
        options={{
          tabBarButtonTestID: 'btn-to-profile-view',
          headerShown: true,
          tabBarLabel: isLoggedIn ? t('navigation.profile') : t('navigation.login'),
          tabBarIcon: ({ focused, color }) => {
            return user ? (
              <Avatar
                source={user.avatar}
                label={user.fullName || t('user.profileView.anonymous')}
                initials={user.avatarLabel}
                size="xs"
                testID="logged-in-profile"
                border="light"
              />
            ) : (
              <HoliIcon icon={focused ? AccountCircleFilled : AccountCircle} colorOverride={color} />
            )
          },
        }}
      />
    </Tabs>
  )
}
