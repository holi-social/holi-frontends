import React from 'react'
import { Text } from 'holi-bricks/components/text'
import { View } from 'react-native'

export const AuthError = () => {
  return (
    <View>
      <Text size="md">Error during authentication</Text>
    </View>
  )
}
