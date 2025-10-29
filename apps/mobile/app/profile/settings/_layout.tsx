import { Stack } from 'expo-router'
import React from 'react'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Text } from 'holi-bricks/components/text'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerBackVisible: false,
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
