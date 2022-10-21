import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

import DonationUpdatesItem from '@holi-apps/donations/components/DonationUpdatesItem'
import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'

type DonationUpdatesProps = {
  locationQuery?: string
}

const DonationUpdates: React.VFC<DonationUpdatesProps> = ({ locationQuery }: DonationUpdatesProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()
  const PROJECT_PAGE_SIZE = 5
  const { width: screenWidth } = useWindowDimensions()

  const { data, error, loading } = useQuery<AppDonationsProjectsResponse>(projectsQuery, {
    variables: {
      locale: i18n.language,
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
      location: locationQuery,
    },
  })

  if (error) {
    logError(error, t('donations:donationListing.error'))
  }

  const { projects = [] } = data?.appDonations_projects || {}

  return (
    <>
      <View style={styles.donationsHeader} testID={'donations-updates-heading'}>
        <View style={styles.donationIconContainer}>
          <HoliIcon icon="hand-heart" size={18} filled color={colors.fontColorGrey} />
        </View>
        <HoliHeading style={{ marginLeft: 10 }}>{t('donations:app.name')}</HoliHeading>
      </View>
      <ScrollView style={styles.scrollViewContainer} horizontal testID={'donations-updates-container'}>
        {projects.map((project, index) => {
          return <DonationUpdatesItem key={index} project={project} />
        })}
        {loading && (
          <View style={styles.loadingContainer}>
            <HoliIcon icon="loader-4" size={50} color={colors.fontColorGrey} spinning />
          </View>
        )}
        <HoliButton
          label={t('donations:donationListing.loadMoreButton.text')}
          style={[styles.buttonContainer, styles.lastButtonContainer]}
          onPress={() => navigate('/apps/donations/')}
          transparent
          inline
          testID={'donations-updates-load-more-button'}
        >
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_user_suggestions.png')}
            width={Platform.OS === 'web' ? 160 : screenWidth / 2 - 26}
            height={Platform.OS === 'web' ? 160 : screenWidth / 2 - 26}
            label=""
          />
          <View style={styles.seeMoreContainer}>
            <HoliText style={styles.seeMoreText} size="small" bold>
              {t('donations:donationListing.loadMoreButton.text')}
            </HoliText>
            <HoliIcon icon="arrow-right-up" size={18} style={styles.seeMoreText} />
          </View>
        </HoliButton>
      </ScrollView>
    </>
  )
}
export default DonationUpdates

const styles = StyleSheet.create({
  donationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  donationIconContainer: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColorGrey,
    backgroundColor: colors.backgroundColorGrey,
  },
  donationListingItem: {
    height: 'auto',
    width: 160,
  },
  scrollViewContainer: {
    paddingVertical: 23,
    marginHorizontal: -20,
    paddingLeft: 20,
  },
  buttonContainer: {
    marginRight: 11,
  },
  loadingContainer: {
    width: 160,
    height: 160,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColorGrey,
  },
  lastButtonContainer: {
    marginRight: 24,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  seeMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seeMoreText: {
    color: colors.secondaryColor,
    textAlign: 'center',
    marginTop: 16,
  },
})
