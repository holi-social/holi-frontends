import React from 'react'
import { View, useWindowDimensions, Platform } from 'react-native'

import Button from '@holi/ui/components/Button'
import useRouting from '@holi/ui/components/navigation/useRouting'
import FeedItemDetail from '@holi-apps/community/components/feed/FeedItemDetail'
import { jsVars } from '@holi/ui/styles/globalVars'

const CommunityFeedDetailScreen: React.VoidFunctionComponent = () => {
  const { navigate, query } = useRouting<{ feedId: string }>()

  const windowHeight = useWindowDimensions().height

  return (
    <View
      style={{
        height: windowHeight - jsVars.CSS_HEADER_Height,
        marginTop: 'auto',
        ...Platform.select({
          web: {
            position: 'absolute',
            bottom: 0,
          },
        }),
      }}
    >
      <FeedItemDetail postId={query.feedId} />
      {/* TODO: put back link into header */}
      <Button onPress={() => navigate('/community')} style={{ marginBottom: 20 }}>
        Schließen
      </Button>
    </View>
  )
}

export { CommunityFeedDetailScreen }
