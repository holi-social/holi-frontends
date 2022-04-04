import React from 'react'
import CommunityLayout from '@holi-apps/community/communityLayout'
import useRouting from '@holi/ui/components/navigation/useRouting'
import Feed from '@holi-apps/community/components/feed/Feed'

const CommunityFeedScreen: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  return (
    <CommunityLayout>
      <Feed onItemPressed={(post) => navigate(`/community/${post.id}`)} />
    </CommunityLayout>
  )
}

export { CommunityFeedScreen }
