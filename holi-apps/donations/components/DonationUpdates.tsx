import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'
import tinycolor from 'tinycolor2'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import variables from '@holi/ui/styles/globalVars/variables'

import DonationUpdatesItem from '@holi-apps/donations/components/DonationUpdatesItem'
import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'
import { Project } from '@holi-apps/donations/typings'

const PROJECT_PAGE_SIZE = 5

type DonationUpdatesProps = {
  locationQuery?: string
  style?: StyleProp<ViewStyle>
}

const DonationUpdates: React.VFC<DonationUpdatesProps> = ({ locationQuery, style }: DonationUpdatesProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const cardImageSize = Platform.OS === 'web' ? 160 : screenWidth / 2 - 26

  const { data, error, loading } = useQuery<AppDonationsProjectsResponse>(projectsQuery, {
    variables: {
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
      location: locationQuery,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (error) {
    logError(error, t('donations:donationListing.error'))
  }

  const { data: projects = [] } = data?.appDonations_projects || {}

  const projectsToRender = projects.slice(0, PROJECT_PAGE_SIZE)

  const renderItem = ({ item, index }: { item: Project; index: number }) => {
    return <DonationUpdatesItem key={index} project={item} />
  }

  const seeMore = () => {
    return loading ? (
      <View style={styles.loadingContainer}>
        <HoliIcon icon="loader-4" size={50} color={colors.fontColorGrey} spinning />
      </View>
    ) : (
      <HoliButton
        label={t('donations:donationListing.loadMoreButton.text')}
        style={[styles.buttonContainer, styles.lastButtonContainer]}
        onPress={() => navigate('/apps/donations/')}
        transparent
        inline
        testID={'donations-updates-load-more-button'}
      >
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_see_more.png')}
          width={cardImageSize}
          height={cardImageSize}
          label=""
        />
        <View style={styles.seeMoreContainer}>
          <HoliText style={styles.seeMoreText} size="small" bold>
            {t('donations:donationListing.loadMoreButton.text')}
          </HoliText>
        </View>
      </HoliButton>
    )
  }

  return (
    <View style={style}>
      <View style={styles.donationsHeader} testID={'donations-updates-heading'}>
        <View style={styles.donationIconContainer}>
          <HoliIcon icon="hand-heart" size={20} color={colors.fontColorGrey} />
        </View>
        <HoliHeading style={{ marginLeft: 12 }}>{t('donations:app.name')}</HoliHeading>
      </View>
      <FlatList
        horizontal
        ListHeaderComponentStyle={styles.listHeader}
        style={styles.itemsContainer}
        data={projectsToRender}
        renderItem={renderItem}
        ListFooterComponent={seeMore}
        testID={'donations-updates-container'}
      />
    </View>
  )
}
export default DonationUpdates

const styles = StyleSheet.create({
  donationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donationIconContainer: {
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tinycolor(colors.borderColorGrey).darken(5).toString(),
    backgroundColor: colors.backgroundColorGrey,
  },
  donationListingItem: {
    height: 'auto',
    width: 160,
  },
  itemsContainer: {
    paddingVertical: 24,
    marginHorizontal: -20,
    paddingLeft: 24,
  },
  buttonContainer: {
    marginRight: 11,
  },
  listHeader: {
    paddingTop: Number(variables.topBarHeight) + 24,
    paddingBottom: 32,
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
    marginRight: Platform.OS === 'web' ? 24 : 48,
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
