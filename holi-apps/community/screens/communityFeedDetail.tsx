import React from 'react'
import { View } from 'react-native'

import Button from '@holi/ui/Button'
import useRouting from '@holi/ui/navigation/useRouting'
import FeedItemDetail from '@holi-apps/community/components/feed/FeedItemDetail'

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
