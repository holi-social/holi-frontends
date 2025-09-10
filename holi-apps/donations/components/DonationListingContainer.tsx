import type React from 'react'
import { useTranslation } from 'react-i18next'

import DonationListing from '@holi-apps/donations/components/DonationListing'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useMemo } from 'react'
import { useErrorHandling } from '@holi/core/errors/hooks'
import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { usePaginatedDonations } from '@holi-apps/donations/hooks/usePaginatedDonations'

export const PROJECT_PAGE_SIZE = 10

type DonationListingProps = {
  loadingGeolocation?: boolean
  selectedLocation?: GeolocationSuggestion
  resetSearch: () => void
}

export const DonationListingContainer: React.FC<DonationListingProps> = ({
  selectedLocation,
  loadingGeolocation,
  resetSearch,
}: DonationListingProps) => {
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const { isLoading, fetchNextPage, canFetchMore, totalResults, projects } = usePaginatedDonations({
    pageSize: PROJECT_PAGE_SIZE,
    selectedLocation,
    loadingGeolocation,
    onError: (error) => {
      displayError(error, 'Failed to load donation projects', {
        displayMessage: t('donations.donationListing.error'),
        location: 'DonationListingContainer.useTypesensePaginationQuery',
        geolocation: selectedLocation?.id,
      })
    },
  })

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
      footerComponent={canFetchMore && loadMoreComponent}
      totalResults={totalResults}
    />
  )
}

const stylesheet = createStyleSheet({
  loadMoreButton: {
    marginBottom: 20,
  },
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})
