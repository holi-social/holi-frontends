import { Stack } from 'expo-router'
import React from 'react'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTintColor: '#000',
        headerBackVisible: false,
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        headerTitle: ({ children, tintColor }) => (
          <HeaderTitle size="large" tintColor={tintColor}>
            {children}
          </HeaderTitle>
        ),
      }}
    />
  )
}
