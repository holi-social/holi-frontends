import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { SpaceByIdResponse, spacePostsQuery } from '@holi/core/screens/spaces/queries'
import { Space, SpaceConnectionType, VisibilityFilter } from '@holi/core/screens/spaces/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'

export interface SpaceUpdatesTabProps {
  space: Space
}

const SpaceUpdatesTab = ({ space }: SpaceUpdatesTabProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const postGridItemsInRow = useBreakpointMatcher()
  const { error, data } = useQuery<SpaceByIdResponse>(spacePostsQuery, {
    variables: { idOrName: space.id, offset: 0, limit: 10, visibility: VisibilityFilter.ALL },
  })

  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const headline = isMember ? t('spaces.updates.noResults.headline.member') : t('spaces.updates.noResults.headline')

  if (error) {
    displayError(error, t('spaces.updates.error'))
  }

  const posts = data?.spaceById.posts?.data || []

  return (
    <>
      {posts.length === 0 ? (
        <HoliBox padding={24}>
          <HoliNoResults
            firstText={t('spaces.updates.noResults.tagline')}
            secondText={headline}
            media={
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/spaceUpdatesEmptyState.svg')}
                label=""
                height={203}
                width={279}
                isSvg
              />
            }
          />
        </HoliBox>
      ) : (
        <HoliGridWrapper itemsInRow={postGridItemsInRow} style={styles.wrapper}>
          {
            /** FIXME convert to VirtualizedList, FlatList or SectionList */
            posts.map((post) => (
              <HoliGridCell key={post.id}>
                <PostPreview post={post} style={styles.postItem} />
              </HoliGridCell>
            ))
          }
        </HoliGridWrapper>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  postItem: {
    borderRadius: 12,
    paddingVertical: 24,
  },
  wrapper: {
    padding: 24,
  },
})

export const SpaceUpdatesTabLazy = dynamicImport<SpaceUpdatesTabProps>(
  () => import('@holi/core/screens/spaces/components/SpaceUpdatesTab')
)

export default SpaceUpdatesTab
