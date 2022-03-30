import React from 'react'
import { View } from 'react-native'

import Button from '@holi/shared/components/ui/Button'
import useRouting from '@holi/shared/components/navigation/useRouting'
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
