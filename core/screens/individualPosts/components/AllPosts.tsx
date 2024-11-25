import { withProfiler } from '@sentry/react'
import React from 'react'
import { Platform } from 'react-native'

import PostsList from '@holi/core/screens/individualPosts/components/PostsList'
import { allPostsQuery } from '@holi/core/screens/individualPosts/queries'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

export const allPostPageSize = Platform.OS == 'web' ? 8 : 6

export const AllPosts = () => {
  return (
    <HoliContainer>
      <PostsList postsQuery={allPostsQuery} paginationOptions={{ queryPath: 'allPosts', pageSize: allPostPageSize }} />
    </HoliContainer>
  )
}

export default withProfiler(AllPosts, { name: 'AllPosts' })
