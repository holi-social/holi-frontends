import React from 'react'
import { View, Text } from 'react-native'

import useRouting from '../../navigation/useRouting'
import Feed from '../../components/feed/Feed'

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
