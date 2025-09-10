import { withProfiler } from '@sentry/react'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'

import DonationListing from '@holi-apps/donations/components/DonationListing'
import { donationProjectsQuery } from '@holi-apps/donations/queries'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import type { Typesense_SearchParams_Input } from '@holi/api/graphql/graphql-codegen'
import { useMemo } from 'react'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

export const PROJECT_PAGE_SIZE = 10

type DonationListingProps = {
  loadingGeolocation?: boolean
  selectedLocation?: GeolocationSuggestion
  resetSearch: () => void
}

const DonationListingContainer: React.FC<DonationListingProps> = ({
  selectedLocation,
  loadingGeolocation,
  resetSearch,
}: DonationListingProps) => {
  const { displayError } = useErrorHandling()
  const language = useUserLanguage()
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  const parameters = useMemo<Typesense_SearchParams_Input>(() => {
    const filterBy = ['type:=[donation]']
    const sortBy = []

    if (selectedLocation) {
      const { latitude, longitude } = selectedLocation.coordinates || {}
      if (latitude && longitude) {
        filterBy.push(`location_lat_lng:(${latitude},${longitude},30 km)`)
        sortBy.push(`location_lat_lng(${latitude},${longitude},precision:5km):asc`)
      }
    }
    return {
      filter_by: filterBy.join('&&'),
      sort_by: sortBy.join(','),
      per_page: PROJECT_PAGE_SIZE,
    }
  }, [selectedLocation])

  const { state, isLoading, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    skip: loadingGeolocation,
    onError: (error) => {
      displayError(error, 'Failed to load donation projects', {
        displayMessage: t('donations.donationListing.error'),
        location: 'DonationListingContainer.useTypesensePaginationQuery',
        geolocation: selectedLocation?.id,
      })
    },
  })

  const projects = useMemo(
    () => state.hits.map((hit) => localizeTypesenseDocument(hit.document, language)),
    [language, state.hits]
  )

  useOnRefresh(refetch)

  const loadMoreComponent = useMemo(() => {
    return (
      <ScrollBasedCallbackInvocation
        callback={fetchNextPage}
        placeholder={<HoliLoader style={styles.loaderBottom} testID="donations-loader" />}
      />
    )
  }, [fetchNextPage, styles.loaderBottom])

  return (
    <DonationListing
      resetSearch={resetSearch}
      isLoading={isLoading || loadingGeolocation}
      isFiltering={!!selectedLocation}
      projects={projects}
      footerComponent={state.canFetchMore && loadMoreComponent}
      totalResults={state.totalResults}
    />
  )
}

const styles = StyleSheet.create({
  loadMoreButton: {
    marginBottom: 20,
  },
})

export default withProfiler(DonationListingContainer, { name: 'DonationListingContainer' })

const stylesheet = createStyleSheet({
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})
