import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import type { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

export interface SpaceUpdatesListProps {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceUpdatesList = ({ space }: SpaceUpdatesListProps) => {
  const { loading, data: posts } = usePaginationContext<Post>()
  const postGridItemsInRow = useBreakpointMatcher()
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  if (loading) return <HoliLoader style={styles.loaderBottom} />

  return (
    <HoliBox padding={[0, 0, 24, 0]}>
      <HoliGridWrapper itemsInRow={postGridItemsInRow} style={styles.wrapper}>
        {posts.map((post) => (
          <HoliGridCell key={post.id}>
            <PostPreview post={post} spaceIdOrName={space.name} hasVisibilityIcon={isMember} />
          </HoliGridCell>
        ))}
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
