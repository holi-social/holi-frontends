import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationListingSkeleton from '@holi-apps/donations/components/DonationListingSkeleton'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
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
  const postGridItemsInRow = useBreakpointMatcher()

  const { loading, data: projects, error, totalResults } = usePaginationContext<Project>()

  const { show: showPartnerModal, hide: closeModal, visible: partnerModalVisible } = useModalState()
  const partner = DONATIONS_IMG_SOURCES_MAPPING['betterplace.org']

  useEffect(() => {
    if (error) {
      displayError(error, 'Failed to load donation projects', {
        displayMessage: t('donations:donationListing.error'),
        location: 'DonationListing.useEffect',
        locationQuery,
      })
    }
  }, [error, displayError, t, locationQuery])

  if (loading) {
    return <DonationListingSkeleton isFiltering={isFiltering} amount={6} />
  }

  return (
    <View testID={isFiltering ? 'donations-list-filtered' : 'donations-list-unfiltered'}>
      {!!projects.length && (
        <HoliBox padding={[24, 0, 16, 0]}>
          <HoliHeading level="1" testID="donations-list-search-heading">
            {t('donations:donationListing.heading')}
          </HoliHeading>
        </HoliBox>
      )}
      {!!projects.length && (
        <>
          <PartnerInfoRow
            rowText={t('donations:app.subline')}
            showOutlinkIcon={false}
            partners={{ 'betterplace.org': partner }}
            onPress={showPartnerModal}
          />
          <PartnerModal
            partners={{ 'betterplace.org': partner }}
            show={partnerModalVisible}
            onDismiss={closeModal}
            i18nNamespace={'donations'}
          />
        </>
      )}

      {isFiltering && !!projects.length && (
        <HoliBox padding={[16, 0, 0, 0]}>
          <View style={styles.searchFilter}>
            <HoliText bold testID="donations-list-search-summary" style={{ color: colors.foreground20 }}>
              {t('donations:donationListing.search.resultCount', { count: totalResults })}
            </HoliText>
            <HoliButton
              inline
              label={t('search.filter.reset')}
              onPress={resetSearch}
              type="secondary"
              variant="small"
              testID="donations-list-search-reset"
            >
              <HoliText>{t('global.reset')}</HoliText>
              <HoliIcon icon={Close} size={20} style={styles.clearFilter} />
            </HoliButton>
          </View>
        </HoliBox>
      )}
      <HoliBox padding={[24, 0, 24, 0]}>
        {isFiltering && !projects.length && (
          <View style={mixins.container}>
            <HoliNoResults
              firstText={t('donations:donationListing.search.empty.tagline')}
              media={
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
                  width={152}
                  height={152}
                  label=""
                  isSvg
                />
              }
              secondText={t('donations:donationListing.search.empty.headline')}
              style={[styles.noResultsMessage]}
            >
              <HoliButton label={t('search.filter.reset')} onPress={resetSearch}>
                {t('search.filter.reset')}
              </HoliButton>
            </HoliNoResults>
          </View>
        )}
        <HoliGridWrapper itemsInRow={postGridItemsInRow} gap={32}>
          {projects
            // FIX: duplication in projects after loading more
            .map((project) => (
              <HoliGridCell key={project.id}>
                <HoliLink href={`/apps/donations/project/${project.id}`} label={project.title}>
                  <HoliCard
                    imageLabel={project.title ?? ''}
                    imageUrl={project.picture[0].url}
                    testID={'donations-list-item'}
                    imageWidth={0}
                  >
                    {!!project.categories[0] && (
                      <>
                        <HoliText size="small" style={{ color: colors.foreground20, marginTop: 8 }}>
                          {t(`donations:category.${project.categories[0]}`)}
                        </HoliText>
                      </>
                    )}
                    <HoliGap size="xs" />
                    <HoliHeading level="2" size="s" selectable>
                      {project.title}
                    </HoliHeading>
                    <HoliGap size="xs" />
                    <DonationProgress
                      category={project.categories[0]}
                      progressPercentage={project.progressPercentage}
                      openAmountInCents={project.openAmountInCents}
                    />
                  </HoliCard>
                </HoliLink>
              </HoliGridCell>
            ))}
        </HoliGridWrapper>
      </HoliBox>
    </View>
  )
}

const styles = StyleSheet.create({
  searchQuery: {
    color: colors.brandColorB30,
  },
  searchFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noResultsMessage: {
    marginTop: 24,
  },
  clearFilter: {
    paddingLeft: 3,
  },
})

export default DonationListing
