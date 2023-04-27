import { useLazyQuery, useQuery } from '@apollo/client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { GeoPlaceDetailsResponse, geoPlaceDetailsQuery } from '@holi/core/location/queries'
import createParam, { arrayParamConfig, singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import FilteredSpacesHeading from '@holi/core/screens/spaces/components/FilteredSpacesHeading'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import SpaceTermContextProvider from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import SpacesGrid from '@holi/core/screens/spaces/components/SpacesGrid'
import { SpacesResponse, spacesQuery } from '@holi/core/screens/spaces/queries'
import { GeolocationMultiPolygon } from '@holi/core/types'
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

  const [fetchPlaceDetails] = useLazyQuery<GeoPlaceDetailsResponse>(geoPlaceDetailsQuery)
  // TODO(SF) combine in object
  const [geolocation, setGeolocation] = useState<GeolocationMultiPolygon>()
  const [locationName, setLocationName] = useState<string>()

  useEffect(() => {
    if (locationId) {
      fetchPlaceDetails({ variables: { id: locationId } })
        .then((response) => {
          const { boundaries, name } = response.data?.geo_placeDetails || {}
          if (boundaries && name) {
            setGeolocation(boundaries?.coordinates)
            setLocationName(name)
          } else {
            setGeolocation(undefined)
            setLocationName(undefined)
          }
        })
        .catch((error) => {
          // TODO(SF) improve? display proper error message to the user?
          logError(error, `[FilteredSpaces.tsx]: Failed to fetch place details: ${error.message}`)
        })
    } else {
      setGeolocation(undefined)
      setLocationName(undefined)
    }
  }, [locationId, fetchPlaceDetails])

  // TODO(SF) delay until geolocation has been fetched?
  const { loading, data, error, fetchMore } = useQuery<SpacesResponse>(spacesQuery, {
    variables: {
      topicSlug: topicSlug,
      location: locationName,
      geolocation: geolocation,
      skillSlugs: skillSlugs,
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

  const filters = { topicSlug, location, skillSlugs }

  return (
    <SpaceTermContextProvider>
      <DefaultScrollHeaderLayout style={styles.wrapper} testID="filtered-spaces-container">
        <View style={mixins.container}>
          <FilteredSpacesHeading {...filters} locationName={locationName} />
          {spaces.length > 0 && !loading && <SpacesGrid style={styles.grid} spaces={spaces} />}
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
        initialGeolocation={geolocation}
        initialLocationQuery={locationName}
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
