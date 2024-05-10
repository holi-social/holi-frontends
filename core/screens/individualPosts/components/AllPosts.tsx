import React from 'react'

import PostsList from '@holi/core/screens/individualPosts/components/PostsList'
import { feedPostsQuery } from '@holi/core/screens/individualPosts/queries'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

export const FEED_POSTS_PAGE_SIZE = 2

export const AllPosts = () => {
  return (
    <HoliContainer>
      <PostsList
        feedPostsQuery={feedPostsQuery}
        paginationOptions={{ queryPath: 'feedPosts', pageSize: FEED_POSTS_PAGE_SIZE }}
      />
    </HoliContainer>
  )
}

export default AllPosts
