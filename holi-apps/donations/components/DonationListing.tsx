import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListingItem from '@holi-apps/donations/components/DonationListingItem'
import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'

const PROJECT_PAGE_SIZE = 5

const DonationListing: React.VFC = () => {
  const { t, i18n } = useTranslation()
  const mixins = useStyleMixins()
  const [fetchingMore, setFetchingMore] = useState(false)

  const { loading, data, error, fetchMore } = useQuery<AppDonationsProjectsResponse>(projectsQuery, {
    variables: {
      locale: i18n.language,
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
    },
  })

  if (loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('donations:donationListing.loading')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('donations:donationListing.error'))
  }

  const projects = data?.appDonations_projects || []
  const moreButtonText = fetchingMore
    ? t('donations:donationListing.loadMoreButton.loading')
    : t('donations:donationListing.loadMoreButton.text')

  return (
    <View>
      {projects.map((project) => (
        <DonationListingItem key={project.id} project={project} />
      ))}
      <HoliButton
        label={moreButtonText}
        disabled={fetchingMore}
        onPress={() => {
          setFetchingMore(true)
          return fetchMore({
            variables: {
              offset: projects.length + PROJECT_PAGE_SIZE,
            },
          }).finally(() => setFetchingMore(false))
        }}
        style={[styles.loadMoreButton]}
        testID="btn-donation-list-load-more"
      >
        <HoliText>{moreButtonText}</HoliText>
      </HoliButton>
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
