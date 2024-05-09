import React, { ReactNode } from 'react'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'

type PostsListProps = {
  emptyMessage: ReactNode
  showVisibilityBadge?: boolean
}

const PostsList = ({ emptyMessage, showVisibilityBadge = false }: PostsListProps) => {
  const { loading, data, totalResults } = usePaginationContext<FeedPost>()

  return (
    <HoliContainer gap={Spacing.xxs}>
      {loading ? (
        <LoadingSkeleton />
      ) : totalResults === 0 ? (
        emptyMessage
      ) : (
        data.map((p) => <PostCard key={p.id} post={p} showVisibilityBadge={showVisibilityBadge} />)
      )}
    </HoliContainer>
  )
}

const LoadingSkeleton = () => <HoliSkeleton height={60} width="100%" borderRadius={20} />

export default PostsList
