import React from 'react'
import { Platform } from 'react-native'

import PostsList from '@holi/core/screens/individualPosts/components/PostsList'
import { feedPostsQuery } from '@holi/core/screens/individualPosts/queries'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

export const feedPostPageSize = Platform.OS == 'web' ? 4 : 2

export const AllPosts = () => {
  return (
    <HoliContainer>
      <PostsList
        feedPostsQuery={feedPostsQuery}
        paginationOptions={{ queryPath: 'feedPosts', pageSize: feedPostPageSize }}
      />
    </HoliContainer>
  )
}

export default AllPosts
