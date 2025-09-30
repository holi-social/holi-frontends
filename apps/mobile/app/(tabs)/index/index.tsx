import FeedHome from '@holi/core/screens/homeFeed/HomeFeed'

import React from 'react'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTintColor: '#000',
          headerBackVisible: false,
          headerTitleAlign: 'center',
          title: '',
          headerShown: true,
        }}
      />
      <FeedHome />
    </>
  )
}
