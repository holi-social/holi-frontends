import { Stack } from 'expo-router'
import React from 'react'
import { useStyles } from 'holi-bricks/styles'

export default function _layout() {
  const { theme } = useStyles()

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: theme.colors.fill.main,
      }}
    />
  )
}
