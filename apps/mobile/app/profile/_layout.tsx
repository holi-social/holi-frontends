import { Stack } from 'expo-router'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import React from 'react'
import { useStyles } from 'holi-bricks/styles'

export default function Layout() {
  const { theme } = useStyles()
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerLargeTitleShadowVisible: false,
        headerTintColor: theme.colors.fill.main,
        headerLeft: () => <HeaderBackButton />,
        headerBackVisible: false,
      }}
    />
  )
}
