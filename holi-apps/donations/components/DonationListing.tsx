import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'

const PROJECT_PAGE_SIZE = 5

const DonationListing: React.VFC = () => {
  const { t, i18n } = useTranslation()
  const mixins = useStyleMixins()

  const { loading, data, error } = useQuery<AppDonationsProjectsResponse>(projectsQuery, {
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
        <HoliText>{t('donations.donationListing.loading')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('donations.donationListing.error'))
  }

  const projects = data?.appDonations_projects?.projects || []

  return (
    <View>
      {projects.map((project) => (
        <HoliText key={project.id}>{project.title}</HoliText>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
})

export default DonationListing
