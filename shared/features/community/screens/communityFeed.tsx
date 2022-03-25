import React from 'react'
import CommunityLayout from 'shared/features/community/communityLayout'
import useRouting from 'shared/components/navigation/useRouting'
import Feed from 'shared/features/community/components/feed/Feed'

const CommunityFeedScreen: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  return (
    <CommunityLayout>
      <Feed onItemPressed={(post) => navigate(`/community/${post.id}`)} />
    </CommunityLayout>
  )
}

export { CommunityFeedScreen }
