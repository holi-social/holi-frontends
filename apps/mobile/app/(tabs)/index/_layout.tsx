import React from 'react'
import { Platform } from 'react-native'
import { Stack } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Layout() {
  const { top } = useSafeAreaInsets()

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackVisible: false,
        headerTitleAlign: 'center',
        title: '',
        headerShown: true,
        ...(Platform.OS === 'ios' && top > 0 ? { headerStatusBarHeight: top } : {}),
      }}
    />
  )
}
