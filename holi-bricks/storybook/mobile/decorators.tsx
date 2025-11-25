import React from 'react'
import type { Decorator } from '@storybook/react-webpack5'
import { View } from 'react-native'

export const withPadding: Decorator = (Story) => {
  return (
    <View style={{ padding: 8 }}>
      <Story />
    </View>
  )
}
