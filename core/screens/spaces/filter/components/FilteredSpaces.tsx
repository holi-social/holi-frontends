import { useApolloClient } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import StyleSheet from 'react-native-media-query'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import FilteredSpacesHeading from '@holi/core/screens/spaces/filter/components/FilteredSpacesHeading'
import FilteredSpacesList from '@holi/core/screens/spaces/filter/components/FilteredSpacesList'
import SpacesGrid from '@holi/core/screens/spaces/filter/components/SpacesGrid'
import { spacesQuery } from '@holi/core/screens/spaces/filter/queries'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { colors } from '@holi/ui/styles/globalVars'

interface FilteredSpacesProps extends SpaceFilter {
  applyFilters: (filters: SpaceFilter) => void
}

export const SPACES_PAGE_SIZE = 12 // needs to be divisible by 2, 3 and 4 (grid widths)

const FilteredSpaces = ({ topicSlug, skillSlugs, locationId, applyFilters }: FilteredSpacesProps) => {
  const { displayError } = useErrorHandling()
  const client = useApolloClient()
  const { t } = useTranslation()

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
      displayError(geolocationError, 'Failed to load geolocation details', {
        displayMessage: t('spaces.spaceListing.error'),
        location: 'FilteredSpaces.useEffect',
        locationId,
      })
    }
  }, [displayError, geolocationError, locationId, t])

  // Error state just hides the component
  if (geolocationError) return null

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
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
  }

  return (
    <SpaceTermContextProvider>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        style={styles.container}
        testID="filtered-spaces-container"
      >
        <HoliContainer>
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
        </HoliContainer>
      </ScrollHeaderLayout.Refreshable>

      <SpaceFilterModal
        filters={filters}
        applyFilters={applyFilters}
        initialLocationSelection={initialLocationSelection}
      />
    </SpaceTermContextProvider>
  )
}

const { styles } = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: colors.background20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  loadingGrid: {
    marginTop: 32,
  },
})

export default withProfiler(memo(FilteredSpaces), { name: 'FilteredSpaces' })
