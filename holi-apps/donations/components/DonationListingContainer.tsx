import { withProfiler } from '@sentry/react'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native-unistyles'

import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'

import DonationListing from '@holi-apps/donations/components/DonationListing'
import { donationProjectsQuery } from '@holi-apps/donations/queries'

export const PROJECT_PAGE_SIZE = 10

type DonationListingProps = {
  locationQuery?: string
  resetSearch: () => void
}

const DonationListingContainer: React.FC<DonationListingProps> = ({
  locationQuery,
  resetSearch,
}: DonationListingProps) => {
  const { t } = useTranslation()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: PROJECT_PAGE_SIZE,
    queryPath: 'appDonations_projects',
    variables: {
      location: locationQuery,
    },
  }

  return (
    <Pagination
      query={donationProjectsQuery}
      queryOptions={queryOptions}
      fetchMoreButtonProps={{
        style: styles.loadMoreButton,
        testID: 'btn-donation-list-load-more',
      }}
      fetchMoreButtonLabel={t('donations.donationListing.loadMoreButton.text')}
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

export default withProfiler(DonationListingContainer, { name: 'DonationListingContainer' })
