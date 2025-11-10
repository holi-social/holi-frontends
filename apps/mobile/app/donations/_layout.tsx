import { Stack } from 'expo-router'
import React from 'react'
import { useStyles } from 'holi-bricks/styles'

export default function Layout() {
  const { theme } = useStyles()

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitle: '',
        headerTitleAlign: 'center',
        headerTintColor: theme.colors.fill.main,
      }}
    />
  )
}
