import { Stack } from 'expo-router'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import ArrowDownS from '@holi/icons/src/generated/ArrowDownS'
import React from 'react'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerLeft: () => <HeaderBackButton icon={ArrowDownS} />,
        headerTitle: '',
      }}
    />
  )
}
