import { useQuery } from '@apollo/client'
import React from 'react'
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

  return (
    <View>
      <HoliText>{projects.length}</HoliText>
      {projects.map((project) => (
        <DonationListingItem key={project.id} project={project} />
      ))}
      <HoliButton
        label={t('donations:donationListing.loadMore')}
        onPress={() => {
          console.debug('fetchMore')
          return fetchMore({
            variables: {
              offset: projects.length + PROJECT_PAGE_SIZE,
            },
          })
        }}
        style={[styles.loadMoreButton]}
        testID="btn-donation-list-load-more"
      >
        <HoliText>{t('donations:donationListing.loadMore')}</HoliText>
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
