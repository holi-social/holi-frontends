import { useQuery } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import DonationButton from '@holi-apps/donations/components/DonationButton'
import DonationListingItem from '@holi-apps/donations/components/DonationListingItem'
import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'

const PROJECT_PAGE_SIZE = 5

const DonationListing: React.VFC = () => {
  const { t, i18n } = useTranslation()
  //const mixins = useStyleMixins()
  const [fetchingMore, setFetchingMore] = useState(false)

  const { data, error, fetchMore } = useQuery<AppDonationsProjectsResponse>(projectsQuery, {
    variables: {
      locale: i18n.language,
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
    },
  })

  const projects = data?.appDonations_projects || []

  const memoizedFetchMore = useCallback(() => {
    setFetchingMore(true)
    return fetchMore({
      variables: {
        offset: projects.length + PROJECT_PAGE_SIZE,
      },
    }).finally(() => setFetchingMore(false))
  }, [fetchMore, projects.length])

  const fetchMoreButtonText = useMemo(() => {
    return fetchingMore
      ? t('donations:donationListing.loadMoreButton.loading')
      : t('donations:donationListing.loadMoreButton.text')
  }, [fetchingMore, t])

  if (error) {
    displayError(error, t('donations:donationListing.error'))
  }

  return (
    <View>
      {projects.map((project) => (
        <DonationListingItem key={project.id} project={project} />
      ))}
      {fetchingMore ? (
        <DonationButton
          label={fetchMoreButtonText}
          disabled={fetchingMore}
          icon="loader-4"
          iconSpinning={fetchingMore}
          onPress={memoizedFetchMore}
          style={[styles.loadMoreButton]}
        />
      ) : (
        <HoliButton
          label={fetchMoreButtonText}
          disabled={fetchingMore}
          onPress={memoizedFetchMore}
          style={[styles.loadMoreButton]}
          testID="btn-donation-list-load-more"
        >
          <HoliText>{fetchMoreButtonText}</HoliText>
        </HoliButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loadMoreButton: {
    marginBottom: 20,
  },
})

export default DonationListing
