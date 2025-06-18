import React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import type { Post } from '@holi/core/screens/posts/types'
import type { Space } from '@holi/api/graphql/graphql-codegen'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
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
  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)
  if (loading) return <HoliLoader style={styles.loaderBottom} />

  return (
    <HoliBox padding={[12, 0, 64, 0]}>
      <HoliGridWrapper>
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
})

export default SpaceUpdatesList
