import React from 'react'
import { Platform, View } from 'react-native'

import Button from 'shared/components/ui/Button'
import useRouting from 'shared/components/navigation/useRouting'
import FeedItemDetail from 'shared/features/community/components/feed/FeedItemDetail'
import { HEADER_HEIGHT, HEADER_MARGIN } from 'shared/styles/constants'

const CommunityFeedDetailScreen: React.VoidFunctionComponent = () => {
  const { navigate, query } = useRouting<{ feedId: string }>()
  return (
    <View
      style={Platform.select({
        web: {
          marginTop: HEADER_HEIGHT + HEADER_MARGIN,
        },
      })}
    >
      <FeedItemDetail postId={query.feedId} />
      <Button onPress={() => navigate('/community')}>back</Button>
    </View>
  )
}

export { CommunityFeedDetailScreen }
