import React from 'react'
import { StyleSheet } from 'react-native'

import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'

import DonationListing from '@holi-apps/donations/components/DonationListing'
import { projectsQuery } from '@holi-apps/donations/queries'

const PROJECT_PAGE_SIZE = 10

type DonationListingProps = {
  locationQuery?: string
  resetSearch: () => void
}

const DonationListingContainer: React.FC<DonationListingProps> = ({
  locationQuery,
  resetSearch,
}: DonationListingProps) => {
  const queryOptions: PaginationQueryHookOptions = {
    pageSize: PROJECT_PAGE_SIZE,
    queryPath: 'appDonations_projects',
    variables: {
      location: locationQuery,
    },
    fetchPolicy: 'cache-and-network',
  }
  // TODO(SF)
  // const fetchMoreButtonText = isFetchingMore
  //   ? t('donations:donationListing.loadMoreButton.loading')
  //   : t('donations:donationListing.loadMoreButton.text')

  return (
    <Pagination
      query={projectsQuery}
      queryOptions={queryOptions}
      buttonProps={{
        style: styles.loadMoreButton,
        testID: 'btn-donation-list-load-more',
      }}
    >
      <DonationListing resetSearch={resetSearch} locationQuery={locationQuery} />
    </Pagination>
  )
}

const styles = StyleSheet.create({
  loadMoreButton: {
    marginBottom: 20,
  },
})

export default DonationListingContainer
