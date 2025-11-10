import { Stack } from 'expo-router'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import ArrowDownS from '@holi/icons/src/generated/ArrowDownS'
import React from 'react'
import { useStyles } from 'holi-bricks/styles'

export default function Layout() {
  const { theme } = useStyles()

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerLeft: () => <HeaderBackButton icon={ArrowDownS} />,
        headerTitle: '',
        headerTintColor: theme.colors.fill.main,
      }}
    />
  )
}
