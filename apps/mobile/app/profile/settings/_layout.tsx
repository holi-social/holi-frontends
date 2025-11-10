import { Stack } from 'expo-router'
import React from 'react'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/styles'

export default function Layout() {
  const { theme } = useStyles()

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerBackVisible: false,
        headerTintColor: theme.colors.fill.main,
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        headerTitle: ({ children }) => (
          <Text headingLevel="1" size="lg">
            {children}
          </Text>
        ),
      }}
    />
  )
}
