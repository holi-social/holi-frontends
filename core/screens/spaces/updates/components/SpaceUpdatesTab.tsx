import { withProfiler } from '@sentry/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import type { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType, VisibilityFilter } from '@holi/core/screens/spaces/types'
import SpaceUpdatesList from '@holi/core/screens/spaces/updates/components/SpaceUpdatesList'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import { GlobalFilled, LockFilled } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { ChipAction } from 'holi-bricks/components/chips'
import { Spacing } from 'holi-bricks/tokens'

export interface SpaceUpdatesTabProps {
  space: Space
  style?: StyleProp<ViewStyle>
}

export const POSTS_RESULT_PAGE_SIZE = 10

export const SpaceUpdatesTab = ({ space, style }: SpaceUpdatesTabProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const styles = getStyles()

  const [filter, setFilter] = useState(VisibilityFilter.ALL)

  const spacePostQueryOptions: PaginationQueryHookOptions = {
    pageSize: POSTS_RESULT_PAGE_SIZE,
    queryPath: 'spaceById.posts',
    onError: (error) => {
      displayError(error, 'Failed to query space posts', {
        location: 'SpaceUpdatesTab',
        spaceId: space.id,
      })
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
  }

  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const headline = isMember ? t('spaces.updates.noResults.headline.member') : t('spaces.updates.noResults.headline')

  const hasPosts = (isMember && space.hasPrivatePosts) || space.hasPublicPosts
  const hasPostFilter = isMember && space.hasPrivatePosts && space.hasPublicPosts

  const isFilterAll = filter === VisibilityFilter.ALL
  const isFilterPublic = filter === VisibilityFilter.PUBLIC
  const isFilterMembers = filter === VisibilityFilter.MEMBERS
  const showNoResults = !hasPosts || (!isMember && !space.hasPublicPosts)

  return (
    <View style={style}>
      {showNoResults && (
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
      )}
      {hasPosts && hasPostFilter && (
        <ScrollView horizontal contentContainerStyle={styles.buttonContainer} style={styles.buttonWrapper}>
          <ChipAction
            onPress={() => setFilter(VisibilityFilter.ALL)}
            selected={isFilterAll}
            color="white"
            size="lg"
            id="1"
          >
            {t('spaces.updates.filter.all')}
          </ChipAction>
          <ChipAction
            onPress={() => setFilter(VisibilityFilter.PUBLIC)}
            selected={isFilterPublic}
            color="white"
            size="lg"
            id="1"
            iconLeading={GlobalFilled}
          >
            {t('spaces.updates.filter.public')}
          </ChipAction>
          <ChipAction
            onPress={() => setFilter(VisibilityFilter.MEMBERS)}
            selected={isFilterMembers}
            color="white"
            size="lg"
            id="1"
            iconLeading={LockFilled}
          >
            {t('spaces.updates.filter.members')}
          </ChipAction>
        </ScrollView>
      )}

      <Pagination
        query={spacePostsQuery}
        queryOptions={{
          ...spacePostQueryOptions,
          variables: { idOrName: space.name, visibility: hasPostFilter ? filter : VisibilityFilter.ALL },
        }}
        loadMoreOnScroll={true}
        scrollPlaceholder={<HoliLoader style={styles.loaderBottom} />}
      >
        <SpaceUpdatesList space={space} />
      </Pagination>
    </View>
  )
}

const getStyles = () =>
  StyleSheet.create({
    buttonContainer: {
      flexGrow: 1,
      gap: 8,
    },
    buttonWrapper: {
      paddingBottom: 12,
      padding: Spacing['4xs'],
    },
    loaderBottom: {
      marginBottom: 24,
      position: 'relative',
    },
  })

export default withProfiler(SpaceUpdatesTab, { name: 'SpaceUpdatesTab' })
