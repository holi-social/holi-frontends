import React from 'react'
import { View } from 'react-native'

import FeedItemDetail from 'shared/components/feed/FeedItemDetail'
import Button from 'shared/components/ui/Button'
import useRouting from 'shared/navigation/useRouting'

export const FeedDetailScreen: React.VoidFunctionComponent = () => {
  const { navigate, query } = useRouting<{ feedId: string }>()
  return (
    <View>
      {/* WARNING: Convention feedId param in native via Linking, in web via file name */}
      {/* TODO typed query */}
      <FeedItemDetail postId={query.feedId} />
      <Button onPress={() => navigate('/community')}>back</Button>
    </View>
  )
}
