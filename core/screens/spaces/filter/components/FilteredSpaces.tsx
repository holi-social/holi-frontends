import { withProfiler } from '@sentry/react'
import React, { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import client from '@holi/api/graphql/client'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import { useGeolocationDetails } from '@holi/core/location/hooks/useGeolocationDetails'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import FilteredSpacesHeading from '@holi/core/screens/spaces/filter/components/FilteredSpacesHeading'
import FilteredSpacesList from '@holi/core/screens/spaces/filter/components/FilteredSpacesList'
import SpacesGrid from '@holi/core/screens/spaces/filter/components/SpacesGrid'
import { spacesQuery } from '@holi/core/screens/spaces/filter/queries'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface FilteredSpacesProps extends SpaceFilter {
  applyFilters: (filters: SpaceFilter) => void
}

export const SPACES_PAGE_SIZE = 12 // needs to be divisible by 2, 3 and 4 (grid widths)

const FilteredSpaces: React.VFC<FilteredSpacesProps> = ({ topicSlug, skillSlugs, locationId, applyFilters }) => {
  const { displayError } = useErrorHandling()

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { height: windowHeight } = useWindowDimensions()
  const styles = getStyles(windowHeight)

  const { geolocationDetails, loadingGeolocation, geolocationError } = useGeolocationDetails(locationId)
  const initialLocationSelection = useMemo<GeolocationSuggestion | undefined>(() => {
    return (
      geolocationDetails && {
        ...geolocationDetails,
        label: geolocationDetails.name,
      }
    )
  }, [geolocationDetails])

  const { refreshing, onRefresh } = useOnRefresh(() => client.refetchQueries({ include: [spacesQuery] }))

  useEffect(() => {
    if (geolocationError) {
      displayError(geolocationError, t('spaces.spaceListing.error'))
    }
  }, [displayError, geolocationError, t])

  // Error state just hides the component
  if (geolocationError) {
    return <></>
  }

  const isLoading = loadingGeolocation || (locationId && !geolocationDetails)

  const filters = { topicSlug, locationId, skillSlugs }

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: SPACES_PAGE_SIZE,
    queryPath: 'spaces',
    variables: {
      topicSlug,
      geolocation: geolocationDetails?.geolocation,
      skillSlugs,
    },
    fetchPolicy: 'cache-and-network',
  }

  return (
    <SpaceTermContextProvider>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          isLoading: refreshing,
          onRefresh,
        }}
        style={styles.wrapper}
        testID="filtered-spaces-container"
      >
        <View style={mixins.container}>
          <FilteredSpacesHeading {...filters} />
          {isLoading ? (
            <SpacesGrid style={styles.loadingGrid} loading={true} pageSize={SPACES_PAGE_SIZE} />
          ) : (
            <Pagination
              query={spacesQuery}
              queryOptions={queryOptions}
              fetchMoreButtonProps={{ style: styles.buttonContainer }}
              fetchMoreButtonLabel={t('spaces.spaceListing.loadMoreButton.text')}
            >
              <FilteredSpacesList pageSize={SPACES_PAGE_SIZE} />
            </Pagination>
          )}
        </View>
      </ScrollHeaderLayout.Refreshable>

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
    buttonContainer: {
      marginTop: 20,
    },
    loadingGrid: {
      marginTop: 32,
    },
  })

export default withProfiler(memo(FilteredSpaces), { name: 'FilteredSpaces' })
