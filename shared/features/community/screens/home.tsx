import React from 'react'
import { View, Text } from 'react-native'

import useRouting from 'shared/components/navigation/useRouting'
import Feed from 'shared/features/community/components/feed/Feed'

const CommunityScreen: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  return (
    <View>
      <Text>Feed</Text>
      <Feed onItemPressed={(post) => navigate(`/community/${post.id}`)} />
    </View>
  )
}

export { CommunityScreen }
