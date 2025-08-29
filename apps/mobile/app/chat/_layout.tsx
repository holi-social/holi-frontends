import { Stack } from 'expo-router'
import React from 'react'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: '#000',
        headerBackVisible: false,
        headerTitleAlign: 'center',
      }}
    />
  )
}
