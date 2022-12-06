import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import FilteredNoResults from '@holi/core/screens/spaces/FilteredNoResults'
import SpaceFilterModal, { SpaceFilterParams } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import SpacesGrid from '@holi/core/screens/spaces/components/SpacesGrid'
import { SpacesResponse, spacesQuery } from '@holi/core/screens/spaces/queries'
import { topicsQuery } from '@holi/core/screens/spaces/queries'
import { TopicsQueryResult } from '@holi/core/screens/userprofile/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const { useParam } = createParam<SpaceFilterParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const SPACES_PAGE_SIZE = 20

const FilteredSpaces: React.VFC<ScreenProps> = () => {
  const [topicId, setTopicId] = useParam('topicId')
  const [location, setLocation] = useParam('location')

  const applyFilters = useCallback(
    (filters) => {
      if (filters.topicId != topicId) {
        setTopicId(filters.topicId)
      }
      if (filters.location != location) {
        setLocation(filters.location)
      }
    },
    [topicId, setTopicId, location, setLocation]
  )

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const [fetchingMore, setFetchingMore] = useState(false)
  const { navigate } = useRouting()

  const { data: topicsData } = useQuery<TopicsQueryResult>(topicsQuery)

  const topics = topicsData?.topics.data || []
  const topic = topics.find((topic) => topic.id === topicId)

  const fallbackTitle = t('spaces.title')
  useLayoutEffect(() => {
    setOptions({ title: topic?.title || fallbackTitle })
  }, [setOptions, topic, fallbackTitle])

  const { loading, data, error, fetchMore } = useQuery<SpacesResponse>(spacesQuery, {
    variables: {
      topicId: topicId,
      location: location,
      limit: SPACES_PAGE_SIZE,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (error) {
    logError(error, `[FilteredSpaces.tsx] ${error.message}`)
  }

  const { data: spaces = [], totalResults = 0 } = data?.spaces || {}

  const canFetchMore = spaces.length < totalResults

  const memoizedFetchMore = useCallback(() => {
    setFetchingMore(true)
    return fetchMore({
      variables: {
        offset: spaces.length,
      },
    }).finally(() => setFetchingMore(false))
  }, [fetchMore, spaces.length])

  const fetchMoreButtonText = fetchingMore
    ? t('spaces.spaceListing.loadMoreButton.loading')
    : t('spaces.spaceListing.loadMoreButton.text')

  // Error state just hides the component
  if (error) {
    return <></>
  }

  return (
    <>
      <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200} style={styles.wrapper}>
        {spaces.length > 0 && <SpacesGrid style={[mixins.container, styles.grid]} spaces={spaces} />}
        {!spaces.length &&
          (loading ? (
            // TODO: replace with proper loading indicator
            <View style={[mixins.container, styles.messageContainer]}>
              <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
            </View>
          ) : (
            // TODO: properly handle not found
            <FilteredNoResults onPress={() => navigate('/spaces')} style={styles.noResults} />
          ))}
        {canFetchMore && (
          <View style={[mixins.container, styles.buttonContainer]}>
            <HoliButton label={fetchMoreButtonText} disabled={fetchingMore} onPress={memoizedFetchMore}>
              <HoliText style={fetchingMore && styles.buttonText}>{fetchMoreButtonText}</HoliText>
              {fetchingMore && <HoliIcon spinning icon="loader-4" size={16} />}
            </HoliButton>
          </View>
        )}
      </DefaultLayout>
      <SpaceFilterModal filters={{ topicId, location }} applyFilters={applyFilters} topics={topics} />
    </>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundColorGrey,
      minHeight: deviceHeight,
    },
    grid: {
      marginTop: 32,
    },
    buttonContainer: {
      marginTop: 20,
    },
    buttonText: {
      marginRight: 6,
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: 50,
    },
    noResults: {
      paddingVertical: 40,
      paddingHorizontal: 24,
      margin: 24,
    },
    searchQuery: {
      color: colors.fontColorHighlighted,
    },
  })

export default memo(FilteredSpaces)
