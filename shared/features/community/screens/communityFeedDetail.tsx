import React from 'react'
import { View } from 'react-native'

import Button from 'shared/components/ui/Button'
import useRouting from 'shared/components/navigation/useRouting'
import FeedItemDetail from 'shared/features/community/components/feed/FeedItemDetail'

const CommunityFeedDetailScreen: React.VoidFunctionComponent = () => {
  const { navigate, query } = useRouting<{ feedId: string }>()
  return (
    <View>
      <FeedItemDetail postId={query.feedId} />
      <Button onPress={() => navigate('/community')}>back</Button>
    </View>
  )
}

export { CommunityFeedDetailScreen }
