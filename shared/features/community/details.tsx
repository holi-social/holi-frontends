import React from 'react'
import { View } from 'react-native'
import FeedItemDetail from '../../components/feed/FeedItemDetail'

import Button from '../../components/ui/Button'
import useRouting from '../../navigation/useRouting'

export const FeedDetailScreen: React.VoidFunctionComponent = () => {
  const { navigate, query } = useRouting()
  return (
    <View>
      {/* WARNING: Convention feedId param in native via Linking, in web via file name */}
      {/* TODO typed query */}
      <FeedItemDetail postId={query.feedId} />
      <Button onPress={() => navigate('/community')}>back</Button>
    </View>
  )
}
