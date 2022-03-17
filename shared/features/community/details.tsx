import React from 'react'
import { View, Text } from 'react-native'

import Button from '../../components/ui/Button'
import useRouting from '../../navigation/useRouting'

export const FeedDetailScreen: React.VoidFunctionComponent = () => {
  const { navigate, query } = useRouting()
  return (
    <View>
      {/* WARNING: Convention feedId param in native via Linking, in web via file name */}
      {/* TODO typed query */}
      <Text>Detail {query.feedId}</Text>
      <Button onPress={() => navigate('/community')}>back</Button>
    </View>
  )
}
