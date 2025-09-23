import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import InfoModal, { type InfoModalItemProps } from '@holi/core/components/InfoModal'
import { Close } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'

import DonationListingSkeleton from '@holi-apps/donations/components/DonationListingSkeleton'
import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'
import { Button } from 'holi-bricks/components/button'
import { DonationCard } from '@holi-apps/donations/components/DonationCard'
import { Spacing } from 'holi-bricks/foundations'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { Text, TextLink } from 'holi-bricks/components/text'
import { Image } from 'holi-bricks/components/image'

type DonationListingProps = {
  isFiltering?: boolean
  isLoading?: boolean
  footerComponent?: React.ReactNode
  projects: LocalizedTypesenseDocument[]
  resetSearch: () => void
  totalResults?: number
}

const DONATIONS_IMG_SOURCES_MAPPING: {
  [name: string]: InfoModalItemProps
} = {
  'betterplace.org': {
    logo: {
      src: require('@holi/ui/assets/img/donations/betterplace-logo.svg'),
      width: 40,
      height: 40,
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/donations/betterplace-wordmark.svg'),
      width: 161,
      height: 24,
      isSvg: true,
    },
    url: 'https://betterplace.org',
  },
}

const DonationListing = ({
  isFiltering,
  isLoading = false,
  totalResults = 0,
  footerComponent,
  projects,
  resetSearch,
}: DonationListingProps) => {
  const { t } = useTranslation()

  const { show: showPartnerModal, hide: closeModal, visible: partnerModalVisible } = useModalState()
  const partner = DONATIONS_IMG_SOURCES_MAPPING['betterplace.org']

  if (isLoading) {
    return <DonationListingSkeleton isFiltering={isFiltering} amount={6} />
  }

  return (
    <View testID={isFiltering ? 'donations-list-filtered' : 'donations-list-unfiltered'}>
      {!!projects.length && (
        <HoliBox padding={[24, 0, 16, 0]}>
          <Text size="3xl" headingLevel="2" testID="donations-list-search-heading">
            {t('donations.donationListing.heading')}
          </Text>
        </HoliBox>
      )}
      {!!projects.length && (
        <>
          <PartnerInfoRow
            rowText={t('donations.app.subline')}
            showOutlinkIcon={false}
            partners={{ 'betterplace.org': partner }}
            onPress={showPartnerModal}
          />
          <InfoModal
            items={{ 'betterplace.org': partner }}
            shown={partnerModalVisible}
            onDismiss={closeModal}
            i18nPrefix={'donations.listing.partnerModal'}
          />
        </>
      )}

      {isFiltering && !!projects.length && (
        <HoliBox padding={[16, 0, 0, 0]}>
          <View style={styles.searchFilter} testID="donations-list-search-summary">
            <TextLink color="support" size="md">
              {t('donations.donationListing.search.resultCount', { count: totalResults })}
            </TextLink>
            <Button
              inline
              label={t('global.reset')}
              onPress={resetSearch}
              variant="secondary"
              size="sm"
              testID="donations-list-search-reset"
              icon={Close}
            />
          </View>
        </HoliBox>
      )}
      <HoliBox padding={[24, 0, 24, 0]}>
        {isFiltering && !projects.length && (
          <HoliContainer>
            <HoliNoResults
              firstText={t('donations.donationListing.search.empty.tagline')}
              media={
                <Image
                  source={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
                  width={152}
                  height={152}
                  alt=""
                />
              }
              secondText={t('donations.donationListing.search.empty.headline')}
              style={[styles.noResultsMessage]}
            >
              <Button label={t('search.filter.reset_one')} onPress={resetSearch} />
            </HoliNoResults>
          </HoliContainer>
        )}
        <HoliGridWrapper gap={Spacing['3xs']}>
          {projects.map((project, index) => (
            <HoliGridCell key={project.id}>
              <DonationCard project={project} index={index} fixedWidth="100%" />
            </HoliGridCell>
          ))}
        </HoliGridWrapper>
      </HoliBox>
      {footerComponent}
    </View>
  )
}

const styles = StyleSheet.create({
  searchFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noResultsMessage: {
    marginTop: 24,
  },
})

export default DonationListing
