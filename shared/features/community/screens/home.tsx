import React from 'react'
import { Text } from 'react-native'
import CommunityLayout from 'shared/features/community/layout'
import useRouting from 'shared/components/navigation/useRouting'
import Feed from 'shared/features/community/components/feed/Feed'

const CommunityScreen: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  return (
    <CommunityLayout>
      <Text>Feed</Text>
      <Feed onItemPressed={(post) => navigate(`/community/${post.id}`)} />
    </CommunityLayout>
  )
}

export { CommunityScreen }
