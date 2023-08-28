import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import type { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'

export interface SpaceUpdatesListProps {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceUpdatesList = ({ space }: SpaceUpdatesListProps) => {
  const { loading, data: posts } = usePaginationContext<Post>()
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  if (loading) return <></>

  return (
    <>
      {posts.map((post) => (
        <HoliGridCell key={post.id}>
          <PostPreview post={post} spaceIdOrName={space.name} hasVisibilityIcon={isMember} />
        </HoliGridCell>
      ))}
    </>
  )
}

export default SpaceUpdatesList
