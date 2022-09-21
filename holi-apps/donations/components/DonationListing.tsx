import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListingItem from '@holi-apps/donations/components/DonationListingItem'
import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'

const PROJECT_PAGE_SIZE = 5

const DonationListing: React.VFC = () => {
  const { t, i18n } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()

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
        <HoliText>{t('donations:donationListing.loading')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('donations:donationListing.error'))
  }

  const projects = data?.appDonations_projects?.projects || []

  return (
    <View>
      {projects.map((project) => (
        <HoliButton
          key={project.id}
          label={project.title}
          onPress={() => navigate(`/apps/donations/project/${project.id}`)}
          transparent
        >
          <DonationListingItem key={project.id} project={project} />
        </HoliButton>
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
