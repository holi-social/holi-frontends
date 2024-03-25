import { withProfiler } from '@sentry/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import type { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType, VisibilityFilter } from '@holi/core/screens/spaces/types'
import SpaceUpdatesList from '@holi/core/screens/spaces/updates/components/SpaceUpdatesList'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobalFilled, LockFilled } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface SpaceUpdatesTabProps {
  space: Space
  style?: StyleProp<ViewStyle>
}

export const POSTS_RESULT_PAGE_SIZE = 10

export const SpaceUpdatesTab = ({ space, style }: SpaceUpdatesTabProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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

  const setButtonStyles = (isSelected: boolean) =>
    StyleSheet.flatten([styles.buttonSpacing, isSelected ? styles.buttonSelected : {}])

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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    buttonContainer: {
      flexGrow: 1,
      gap: 8,
    },
    buttonWrapper: {
      paddingBottom: 12,
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
      backgroundColor: theme.colors.foreground30,
      borderColor: theme.colors.foreground30,
    },
    icon: {
      marginRight: 5,
    },
    loaderBottom: {
      marginBottom: 24,
      position: 'relative',
    },
  })

export default withProfiler(SpaceUpdatesTab, { name: 'SpaceUpdatesTab' })
