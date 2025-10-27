import { Stack } from 'expo-router'
import React from 'react'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: '#000',
        headerBackVisible: false,
        headerTitleAlign: 'center',
      }}
    />
  )
}
