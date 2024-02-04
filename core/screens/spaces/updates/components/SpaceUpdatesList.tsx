import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import type { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { POSTS_RESULT_PAGE_SIZE } from '@holi/core/screens/spaces/updates/components/SpaceUpdatesTab'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'

export interface SpaceUpdatesListProps {
  space: Space
  style?: StyleProp<ViewStyle>
}

export const SpaceUpdatesScrollPlaceholder = () => {
  const postGridItemsInRow = useBreakpointMatcher()
  return (
    <HoliGridWrapper itemsInRow={postGridItemsInRow} style={styles.wrapper}>
      <SpaceUpdatesSkeleton />
    </HoliGridWrapper>
  )
}
export const SpaceUpdatesSkeleton = () => {
  return new Array(POSTS_RESULT_PAGE_SIZE).fill(1).map((_, idx) => (
    <HoliGridCell key={idx}>
      <PostPreview numberOfLines={3} hasVisibilityIcon loading />
    </HoliGridCell>
  ))
}

const SpaceUpdatesList = ({ space }: SpaceUpdatesListProps) => {
  const { loading, data: posts } = usePaginationContext<Post>()
  const postGridItemsInRow = useBreakpointMatcher()
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  return (
    <HoliBox padding={[0, 0, 24, 0]}>
      <HoliGridWrapper itemsInRow={postGridItemsInRow ?? 2} style={styles.wrapper}>
        {loading ? (
          <SpaceUpdatesSkeleton />
        ) : (
          posts.map((post) => (
            <HoliGridCell key={post.id}>
              <PostPreview post={post} spaceIdOrName={space.name} hasVisibilityIcon={isMember} />
            </HoliGridCell>
          ))
        )}
      </HoliGridWrapper>
    </HoliBox>
  )
}

const styles = StyleSheet.create({
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
  wrapper: {
    paddingTop: 12,
  },
})

export default SpaceUpdatesList
