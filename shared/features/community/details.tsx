import React from 'react'
import { View } from 'react-native'

import Button from 'shared/components/ui/Button'
import useRouting from 'shared/navigation/useRouting'
import FeedItemDetail from 'shared/components/feed/FeedItemDetail'

export const FeedDetailScreen: React.VoidFunctionComponent = () => {
  const { navigate, query } = useRouting<{ feedId: string }>()
  return (
    <View>
      <FeedItemDetail postId={query.feedId} />
      <Button onPress={() => navigate('/community')}>back</Button>
    </View>
  )
}
