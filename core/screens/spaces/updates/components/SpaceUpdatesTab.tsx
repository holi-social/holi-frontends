import { withProfiler } from '@sentry/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import type { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType, VisibilityFilter } from '@holi/core/screens/spaces/types'
import SpaceUpdatesList from '@holi/core/screens/spaces/updates/components/SpaceUpdatesList'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobalFilled, LockFilled } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors } from '@holi/ui/styles/globalVars'

export interface SpaceUpdatesTabProps {
  space: Space
  style?: StyleProp<ViewStyle>
}

const POSTS_RESULT_PAGE_SIZE = 10

const SpaceUpdatesTab = ({ space, style }: SpaceUpdatesTabProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const postGridItemsInRow = useBreakpointMatcher()

  const [filter, setFilter] = useState(VisibilityFilter.ALL)

  const spacePostQueryOptions: PaginationQueryHookOptions = {
    pageSize: POSTS_RESULT_PAGE_SIZE,
    queryPath: 'spaceById.posts',
    onError: (error) => {
      displayError(error, t('global.technicalError'))
    },
    fetchPolicy: 'cache-first',
  }

  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const headline = isMember ? t('spaces.updates.noResults.headline.member') : t('spaces.updates.noResults.headline')

  const hasPosts = space.hasPrivatePosts || space.hasPublicPosts
  const hasPostFilter = isMember && space.hasPublicPosts

  const isFilterAll = filter === VisibilityFilter.ALL
  const isFilterPublic = filter === VisibilityFilter.PUBLIC
  const isFilterMembers = filter === VisibilityFilter.MEMBERS

  const setButtonStyles = (isSelected: boolean) =>
    StyleSheet.flatten([styles.buttonSpacing, isSelected ? styles.buttonSelected : {}])

  return (
    <View style={style}>
      {!hasPosts && (
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
          <HoliButton
            type="secondary"
            label={t('spaces.updates.filter.all')}
            onPress={() => setFilter(VisibilityFilter.ALL)}
            style={setButtonStyles(isFilterAll)}
          >
            <HoliText size="small" numberOfLines={1} ellipsizeMode="clip" color={isFilterAll ? 'white100' : 'black300'}>
              {t('spaces.updates.filter.all')}
            </HoliText>
          </HoliButton>
          <HoliButton
            type="secondary"
            label={t('spaces.updates.filter.public')}
            onPress={() => setFilter(VisibilityFilter.PUBLIC)}
            style={setButtonStyles(isFilterPublic)}
          >
            <HoliIcon
              icon={GlobalFilled}
              size={14}
              color={isFilterPublic ? colors.white100 : colors.foreground30}
              style={styles.icon}
            />
            <HoliText
              size="small"
              numberOfLines={1}
              ellipsizeMode="clip"
              color={isFilterPublic ? 'white100' : 'black300'}
            >
              {t('spaces.updates.filter.public')}
            </HoliText>
          </HoliButton>
          <HoliButton
            type="secondary"
            label={t('spaces.updates.filter.members')}
            onPress={() => setFilter(VisibilityFilter.MEMBERS)}
            style={setButtonStyles(isFilterMembers)}
          >
            <HoliIcon
              icon={LockFilled}
              size={14}
              color={isFilterMembers ? colors.white100 : colors.foreground30}
              style={styles.icon}
            />
            <HoliText
              size="small"
              numberOfLines={1}
              ellipsizeMode="clip"
              color={isFilterMembers ? 'white100' : 'black300'}
            >
              {t('spaces.updates.filter.members')}
            </HoliText>
          </HoliButton>
        </ScrollView>
      )}

      <HoliBox padding={[0, 0, 24, 0]}>
        <HoliGridWrapper itemsInRow={postGridItemsInRow} style={styles.wrapper}>
          <Pagination
            query={spacePostsQuery}
            queryOptions={{
              ...spacePostQueryOptions,
              variables: { idOrName: space.name, visibility: filter },
            }}
            loadMoreOnScroll={true}
            scrollPlaceholder={<HoliLoader style={styles.loaderBottom} />}
          >
            <SpaceUpdatesList space={space} />
          </Pagination>
        </HoliGridWrapper>
      </HoliBox>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexGrow: 1,
    gap: 8,
  },
  buttonWrapper: {
    paddingBottom: 12,
  },
  wrapper: {
    paddingTop: 12,
  },
  buttonSpacing: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    flex: 1,
    ...Platform.select({
      web: {
        minWidth: 'fit-content',
        maxWidth: '33%',
      },
    }),
  },
  buttonSelected: {
    backgroundColor: colors.foreground30,
    borderColor: colors.foreground30,
  },
  icon: {
    marginRight: 5,
  },
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})

export const SpaceUpdatesTabLazy = dynamicImport<SpaceUpdatesTabProps>(
  () => import('@holi/core/screens/spaces/updates/components/SpaceUpdatesTab')
)

export default withProfiler(SpaceUpdatesTab, { name: 'SpaceUpdatesTab' })
