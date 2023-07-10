import React, { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListingItem from '@holi-apps/donations/components/DonationListingItem'
import DonationListingItemFiltered from '@holi-apps/donations/components/DonationListingItemFiltered'
import { Project } from '@holi-apps/donations/typings'
import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'
import PartnerModal from '@holi-apps/volunteering/components/PartnerModal'
import { PartnerProps } from '@holi-apps/volunteering/types'

type DonationListingProps = {
  locationQuery?: string
  resetSearch: () => void
}

const DONATIONS_IMG_SOURCES_MAPPING: {
  [name: string]: PartnerProps
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

const DonationListing = ({ locationQuery, resetSearch }: DonationListingProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const isFiltering = useMemo(() => !!locationQuery, [locationQuery])
  const { displayError } = useErrorHandling()

  const { loading, data: projects, error, totalResults } = usePaginationContext<Project>()

  const { show: showPartnerModal, hide: closeModal, visible: show } = useModalState()
  const partner = DONATIONS_IMG_SOURCES_MAPPING['betterplace.org']

  useEffect(() => {
    if (error) {
      displayError(error, t('donations:donationListing.error'))
    }
  }, [error, displayError, t])

  if (loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('donations:donationListing.loading')}</HoliText>
      </View>
    )
  }

  return (
    <View testID={isFiltering ? 'donations-list-filtered' : 'donations-list-unfiltered'}>
      <HoliBox padding={[24, 0, 16, 0]}>
        {isFiltering && (
          <HoliHeading testID="donations-list-search-heading">
            <Trans t={t} i18nKey="donations:donationListing.search.heading" values={{ location: locationQuery }}>
              <HoliText size="large" bold style={styles.searchQuery} />
            </Trans>
          </HoliHeading>
        )}
        {!isFiltering && (
          <HoliHeading level="1" testID="donations-list-search-heading">
            {t('donations:donationListing.heading')}
          </HoliHeading>
        )}
      </HoliBox>
      <PartnerInfoRow
        rowText={t('donations:app.subline')}
        showOutlinkIcon={false}
        partner={partner}
        onPress={showPartnerModal}
      />
      <PartnerModal
        headline={t('donations:listing.partnerModal.headline')}
        text={t('donations:listing.partnerModal.text')}
        buttonText={t('donations:listing.partnerModal.link.text')}
        partner={partner}
        show={show}
        onDismiss={closeModal}
      />
      {isFiltering && (
        <HoliBox padding={[16, 0, 0, 0]}>
          <View style={styles.searchFilter}>
            <HoliText bold testID="donations-list-search-summary">
              {t('donations:donationListing.search.resultCount', { count: totalResults })}
            </HoliText>
            <HoliButton
              transparent
              inline
              label={t('search.filter.reset')}
              onPress={resetSearch}
              testID="donations-list-search-reset"
            >
              <HoliText size="small" style={{ color: colors.foreground20 }}>
                {t('search.filter.reset')}
              </HoliText>
            </HoliButton>
          </View>
        </HoliBox>
      )}
      <HoliBox padding={[24, 0, 24, 0]}>
        {isFiltering && !projects.length && (
          <View style={styles.noResultsContainer}>
            <View style={styles.imageContainer}>
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_no_results.png')}
                width={179}
                height={131}
                label=""
                resizeMode="stretch"
              />
            </View>
            <HoliText style={styles.noResultsHint}>{t('donations:donationListing.search.noResults')}</HoliText>
          </View>
        )}
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          projects
            // FIX: duplication in projects after loading more
            .map((project) =>
              isFiltering ? (
                <DonationListingItemFiltered key={project.id} project={project} />
              ) : (
                <DonationListingItem key={project.id} project={project} />
              )
            )
        }
      </HoliBox>
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
  searchQuery: {
    color: colors.brandColorB30,
  },
  searchFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 32,
  },
  imageContainer: {
    padding: 18,
    marginBottom: 10,
  },
  noResultsHint: {
    textAlign: 'center',
  },
})

export default DonationListing
