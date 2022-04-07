import React from 'react'
import { Platform, View } from 'react-native'

import Button from '@holi/ui/components/Button'
import useRouting from '@holi/ui/components/navigation/useRouting'
import FeedItemDetail from '@holi-apps/community/components/feed/FeedItemDetail'
import { HEADER_HEIGHT, HEADER_MARGIN } from '@holi/ui/styles/globalVars/constants'

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
