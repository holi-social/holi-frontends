import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
//import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import { colors } from '@holi/ui/styles/globalVars'

import DonationImage from '@holi-apps/donations/components/DonationImage'
//import DonationListingItem from '@holi-apps/donations/components/DonationListingItem'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'

const PROJECT_PAGE_SIZE = 8

type DonationUpdatesProps = {
  locationQuery?: string
}

const DonationUpdates: React.VFC<DonationUpdatesProps> = ({ locationQuery }: DonationUpdatesProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()

  const { data } = useQuery<AppDonationsProjectsResponse>(projectsQuery, {
    variables: {
      locale: i18n.language,
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
      location: locationQuery,
    },
  })

  const { projects = [] } = data?.appDonations_projects || {}

  return (
    <>
      <View style={styles.donationsHeader}>
        <View style={styles.donationIconContainer}>
          <HoliIcon icon="hand-heart" size={18} filled color={colors.fontColorGrey} />
        </View>
        <HoliHeading style={{ marginLeft: 10 }}>{t('donations:app.name')}</HoliHeading>
      </View>
      {/*       
      <HoliCarousel
        slides={projects.map((project, index) => ({
          children: <DonationListingItem key={index} project={project} small />,
        }))}
      />
      */}
      <ScrollView style={styles.scrollViewContainer} horizontal>
        {projects.map((project, index) => {
          return (
            <HoliButton
              label={project.title}
              onPress={() => navigate(`/apps/donations/project/${project.id}`)}
              style={styles.buttonContainer}
              key={project.id}
              transparent
              inline
              testID={`donations-list-item-${index}`}
            >
              <View style={styles.donationListingItem}>
                <DonationImage picture={project.picture} style={styles.mainImage} label={''} />
                <HoliText size="small" numberOfLines={2} style={{ marginTop: 16 }}>
                  {project.title}
                </HoliText>
                <DonationProgress
                  donationsCount={project.donationsCount}
                  progressPercentage={project.progressPercentage}
                  openAmountInCents={project.openAmountInCents}
                  size="small"
                />
              </View>
            </HoliButton>
          )
        })}
        <HoliButton
          label={'seeMore.button'}
          style={[styles.buttonContainer, styles.lastButtonContainer]}
          onPress={() => navigate('/apps/donations/')}
          transparent
          inline
        >
          <View style={styles.seeMoreImageContainer}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_user_suggestions.png')}
              width={125.6}
              height={125.6}
              label=""
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <HoliText style={styles.seeMoreText} size="small" bold>
              {t('homeFeed.userSuggestions.loadMore')}
            </HoliText>
            <HoliIcon icon="share-box" size={18} style={[styles.seeMoreText, styles.seeMoreIcon]} />
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
    backgroundColor: colors.backgroundColorGrey,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColorGrey,
  },
  donationListingItem: {
    height: 'auto',
    width: 160,
  },
  scrollViewContainer: {
    paddingVertical: 23,
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
  mainImage: {
    borderRadius: 10,
    marginBottom: 8,
    width: 160,
    height: 160,
  },
  seeMoreImageContainer: {
    padding: 17.2,
  },
  seeMoreText: {
    color: colors.secondaryColor,
    textAlign: 'center',
    marginTop: 16,
  },
  seeMoreIcon: {
    marginLeft: 8,
  },
})
