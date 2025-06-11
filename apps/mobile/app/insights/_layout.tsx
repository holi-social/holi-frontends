import { Stack } from 'expo-router'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import React from 'react'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: '#000',
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderBackButton />,
        headerBackVisible: false,
      }}
    />
  )
}
