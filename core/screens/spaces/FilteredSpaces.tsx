import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import createParam, { arrayParamConfig, singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import FilteredSpacesHeading from '@holi/core/screens/spaces/components/FilteredSpacesHeading'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import SpaceTermContextProvider from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import SpacesGrid from '@holi/core/screens/spaces/components/SpacesGrid'
import { SpacesResponse, spacesQuery } from '@holi/core/screens/spaces/queries'
import type { BottomTabsScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type FilteredSpacesParams = {
  topicId?: string
  location?: string
  skillId?: string[]
}

const { useParam, useUpdateParams } = createParam<FilteredSpacesParams>()

type ScreenProps = NativeStackScreenProps<BottomTabsScreens>

const SPACES_PAGE_SIZE = 20

const FilteredSpaces: React.VFC<ScreenProps> = () => {
  const [topicId] = useParam('topicId', singleParamConfig)
  const [location] = useParam('location', singleParamConfig)
  const [skillIds] = useParam('skillId', arrayParamConfig)
  const updateParams = useUpdateParams()
  const { navigate } = useRouting()

  const applyFilters = useCallback(
    (filters: SpaceFilter) => {
      if (!filters.topicId && !filters.location && !filters.skillIds?.length) {
        navigate('/spaces')
      } else {
        const { topicId, location } = filters
        updateParams({ topicId, location, skillId: filters.skillIds })
      }
    },
    [updateParams, navigate]
  )

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const onScreenScroll = useScrollYHandler()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const [fetchingMore, setFetchingMore] = useState(false)

  const { loading, data, error, fetchMore } = useQuery<SpacesResponse>(spacesQuery, {
    variables: {
      topicId: topicId,
      location: location,
      skillIds: skillIds,
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

  const filters = { topicId, location, skillIds }

  return (
    <SpaceTermContextProvider>
      <DefaultLayout
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={styles.wrapper}
        testID="filtered-spaces-container"
      >
        <View style={mixins.container}>
          <FilteredSpacesHeading {...filters} />
          {spaces.length > 0 && <SpacesGrid style={styles.grid} spaces={spaces} />}
          {!spaces.length &&
            (loading ? (
              // TODO: replace with proper loading indicator
              <View style={styles.messageContainer}>
                <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
              </View>
            ) : (
              <HoliNoResults
                firstText={t('spaces.filter.notFound.title')}
                secondText={t('spaces.filter.notFound.description')}
                style={styles.noResults}
              >
                <HoliButton label={t('search.filter.reset')} onPress={() => navigate('/spaces')} inline>
                  {t('search.filter.reset')}
                </HoliButton>
              </HoliNoResults>
            ))}

          {canFetchMore && (
            <View style={[mixins.container, styles.buttonContainer]}>
              <HoliButton label={fetchMoreButtonText} disabled={fetchingMore} onPress={memoizedFetchMore}>
                <HoliText style={fetchingMore && styles.buttonText}>{fetchMoreButtonText}</HoliText>
                {fetchingMore && <HoliIcon spinning icon="loader-4" size={16} />}
              </HoliButton>
            </View>
          )}
        </View>
      </DefaultLayout>
      <SpaceFilterModal filters={filters} applyFilters={applyFilters} />
    </SpaceTermContextProvider>
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
      marginTop: 24,
    },
  })

export default memo(FilteredSpaces)
