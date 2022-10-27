import { useQuery } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationButton from '@holi-apps/donations/components/DonationButton'
import DonationListingItem from '@holi-apps/donations/components/DonationListingItem'
import DonationListingItemFiltered from '@holi-apps/donations/components/DonationListingItemFiltered'
import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'

const PROJECT_PAGE_SIZE = 10

type DonationListingProps = {
  locationQuery?: string
  resetSearch: () => void
}

const DonationListing: React.VFC<DonationListingProps> = ({ locationQuery, resetSearch }: DonationListingProps) => {
  const { t, i18n } = useTranslation()
  const mixins = useStyleMixins()
  const [fetchingMore, setFetchingMore] = useState(false)
  const isFiltering = useMemo(() => !!locationQuery, [locationQuery])

  const { loading, data, error, fetchMore } = useQuery<AppDonationsProjectsResponse>(projectsQuery, {
    variables: {
      locale: i18n.language,
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
      location: locationQuery,
    },
  })

  const { projects = [], totalResults = 0 } = data?.appDonations_projects || {}

  const canFetchMore = useMemo(() => {
    return projects.length < totalResults
  }, [projects, totalResults])

  const memoizedFetchMore = useCallback(() => {
    setFetchingMore(true)
    return fetchMore({
      variables: {
        offset: projects.length,
      },
    }).finally(() => setFetchingMore(false))
  }, [fetchMore, projects.length])

  const fetchMoreButtonText = useMemo(() => {
    return fetchingMore
      ? t('donations:donationListing.loadMoreButton.loading')
      : t('donations:donationListing.loadMoreButton.text')
  }, [fetchingMore, t])

  if (error) {
    displayError(error, t('donations:donationListing.error'))
  }

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
      {isFiltering && (
        <HoliHeading style={styles.searchHeading} testID="donations-list-search-heading">
          <Trans t={t} i18nKey="donations:donationListing.search.heading" values={{ location: locationQuery }}>
            <HoliText size="large" bold style={styles.searchQuery} />
          </Trans>
        </HoliHeading>
      )}
      {isFiltering && (
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
            <HoliText size="small" style={{ color: colors.fontColorGrey }}>
              {t('search.filter.reset')}
            </HoliText>
          </HoliButton>
        </View>
      )}
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
      {projects.map((project) =>
        isFiltering ? (
          <DonationListingItemFiltered key={project.id} project={project} />
        ) : (
          <DonationListingItem key={project.id} project={project} />
        )
      )}
      {canFetchMore && (
        <DonationButton
          label={fetchMoreButtonText}
          disabled={fetchingMore}
          icon={fetchingMore ? 'loader-4' : undefined}
          iconSpinning={fetchingMore}
          onPress={memoizedFetchMore}
          style={[styles.loadMoreButton]}
          testID="btn-donation-list-load-more"
        />
      )}
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
  searchHeading: {
    marginBottom: 14,
  },
  searchQuery: {
    color: colors.positivepurple,
  },
  searchFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
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
