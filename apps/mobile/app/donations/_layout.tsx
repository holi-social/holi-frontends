import { Stack } from 'expo-router'
import React from 'react'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: '#000',
        headerShadowVisible: false,
        headerTitle: '',
        headerTitleAlign: 'center',
      }}
    />
  )
}
