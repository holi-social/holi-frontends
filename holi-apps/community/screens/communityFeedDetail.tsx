import React from 'react'
import { Platform, View } from 'react-native'

import Button from '@holi/ui/components/Button'
import useRouting from '@holi/ui/components/navigation/useRouting'
import FeedItemDetail from '@holi-apps/community/components/feed/FeedItemDetail'
import { jsVars } from '@holi/ui/styles/globalVars'

const CommunityFeedDetailScreen: React.VoidFunctionComponent = () => {
  const { navigate, query } = useRouting<{ feedId: string }>()
  return (
    <View
      style={{
        height: '100%',
        ...Platform.select({
          web: {
            marginTop: jsVars.CSS_HEADER_Height,
          },
        }),
      }}
    >
      <FeedItemDetail postId={query.feedId} />
      {/* TODO: put back link into header */}
      <Button onPress={() => navigate('/community')}>back</Button>
    </View>
  )
}

export { CommunityFeedDetailScreen }
