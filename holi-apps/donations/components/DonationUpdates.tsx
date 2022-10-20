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
//import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { colors } from '@holi/ui/styles/globalVars'

import DonationListingItem from '@holi-apps/donations/components/DonationListingItem'
import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'

type DonationUpdatesProps = {
  locationQuery?: string
}

const DonationUpdates: React.VFC<DonationUpdatesProps> = ({ locationQuery }: DonationUpdatesProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()
  const PROJECT_PAGE_SIZE = 8
  const { width: screenWidth } = useWindowDimensions()

  const { data, error } = useQuery<AppDonationsProjectsResponse>(projectsQuery, {
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
      <View style={styles.donationsHeader}>
        <View style={styles.donationIconContainer}>
          <HoliIcon icon="hand-heart" size={18} filled color={colors.fontColorGrey} />
        </View>
        <HoliHeading style={{ marginLeft: 10 }}>{t('donations:app.name')}</HoliHeading>
      </View>
      <ScrollView style={styles.scrollViewContainer} horizontal>
        {projects.map((project, index) => {
          return (
            <DonationListingItem
              key={index}
              project={project}
              small
              style={{
                width: Platform.OS === 'web' ? 160 : screenWidth / 2 - 25,
                marginRight: 11,
              }}
            />
          )
        })}
        <HoliButton
          label={'seeMore.button'}
          style={[styles.buttonContainer, styles.lastButtonContainer]}
          onPress={() => navigate('/apps/donations/')}
          transparent
          inline
        >
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_user_suggestions.png')}
            width={Platform.OS === 'web' ? 160 : screenWidth / 2 - 25}
            height={Platform.OS === 'web' ? 160 : screenWidth / 2 - 25}
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
