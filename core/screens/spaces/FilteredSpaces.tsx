import { useLazyQuery } from '@apollo/client'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import { useGeolocationDetails } from '@holi/core/location/hooks/useGeolocationDetails'
import createParam, { arrayParamConfig, singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import FilteredSpacesHeading from '@holi/core/screens/spaces/components/FilteredSpacesHeading'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import SpacesGrid from '@holi/core/screens/spaces/components/SpacesGrid'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { SpacesResponse, spacesQuery } from '@holi/core/screens/spaces/queries'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type FilteredSpacesParams = {
  topic?: string
  location?: string
  skill?: string[]
}

const { useParam, useUpdateParams } = createParam<FilteredSpacesParams>()

const SPACES_PAGE_SIZE = 20

const FilteredSpaces: React.VFC = () => {
  const [topicSlug] = useParam('topic', singleParamConfig)
  const [locationId] = useParam('location', singleParamConfig)
  const [skillSlugs] = useParam('skill', arrayParamConfig)
  const updateParams = useUpdateParams()
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()

  const applyFilters = useCallback(
    (filters: SpaceFilter) => {
      if (!filters.topicSlug && !filters.locationId && !filters.skillSlugs?.length) {
        navigate('/spaces')
      } else {
        updateParams({
          topic: filters.topicSlug,
          location: filters.locationId,
          skill: filters.skillSlugs,
        })
      }
    },
    [updateParams, navigate]
  )

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const [fetchingMore, setFetchingMore] = useState(false)

  const { geolocationDetails, loadingGeolocation, geolocationError } = useGeolocationDetails(locationId)
  const initialLocationSelection = useMemo<GeolocationSuggestion | undefined>(() => {
    return (
      geolocationDetails && {
        ...geolocationDetails,
        label: geolocationDetails.name,
      }
    )
  }, [geolocationDetails])

  const [fetchSpaces, { loading: loadingSpaces, data, error: errorSpaces, fetchMore }] = useLazyQuery<SpacesResponse>(
    spacesQuery,
    {
      variables: {
        topicSlug: topicSlug,
        geolocation: geolocationDetails?.geometry,
        skillSlugs: skillSlugs,
        limit: SPACES_PAGE_SIZE,
        offset: 0,
      },
      fetchPolicy: 'cache-and-network',
    }
  )

  useEffect(() => {
    if (locationId && !geolocationDetails) return

    fetchSpaces()
  }, [fetchSpaces, geolocationDetails, locationId])

  useEffect(() => {
    const anyError = errorSpaces || geolocationError
    if (anyError) {
      displayError(anyError, t('spaces.spaceListing.error'))
    }
  }, [displayError, errorSpaces, geolocationError, t])

  const { data: spaces = [], totalResults = 0 } = data?.spaces || {}

  const canFetchMore = spaces.length < totalResults

  const memoizedFetchMore = useCallback(async () => {
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
  if (errorSpaces || geolocationError) {
    return <></>
  }

  const isLoading = loadingSpaces || loadingGeolocation

  const filters = { topicSlug, locationId, skillSlugs }

  return (
    <SpaceTermContextProvider>
      <DefaultScrollHeaderLayout style={styles.wrapper} testID="filtered-spaces-container">
        <View style={mixins.container}>
          <FilteredSpacesHeading {...filters} />
          {spaces.length > 0 && !isLoading && <SpacesGrid style={styles.grid} spaces={spaces} />}
          {!spaces.length &&
            (isLoading ? (
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
                <HoliButton
                  label={t('search.filter.reset')}
                  onPress={() => navigate('/spaces')}
                  inline
                  testID="spaces-filter-reset"
                >
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
      </DefaultScrollHeaderLayout>

      <SpaceFilterModal
        filters={filters}
        applyFilters={applyFilters}
        initialLocationSelection={initialLocationSelection}
      />
    </SpaceTermContextProvider>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background20,
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
