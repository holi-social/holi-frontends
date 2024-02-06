import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { logError } from '@holi/core/errors/helpers'
import { useBreakpointMatcher } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import usePaginationQuery from '@holi/core/pagination/usePaginationQuery'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import '@holi-apps/goodnews/queries'
import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'
import PartnerModal from '@holi-apps/volunteering/components/PartnerModal'
import VolunteeringCardContent from '@holi-apps/volunteering/components/VolunteeringCardContent'
import VolunteeringListingSkeleton from '@holi-apps/volunteering/components/VolunteeringListingSkeleton'
import { volunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'
import { VOLUNTEERING_IMG_SOURCES_MAPPING } from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'
import { VolunteeringEngagement, VolunteeringFilters } from '@holi-apps/volunteering/types'

type VolunteeringListingProps = {
  filters: VolunteeringFilters
  isFiltering?: boolean
  clearFilters?: () => void
  loadingFilters: boolean
  filterError?: boolean
}

export const ENGAGEMENT_PAGE_SIZE = 10

const VolunteeringListing = ({
  filters = {},
  isFiltering,
  clearFilters,
  loadingFilters,
  filterError,
}: VolunteeringListingProps) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const insets = useSafeAreaInsets()
  const styles = getStyles(insets.bottom)
  const { imageWidth } = useWindowDimensionsWithImageScaling()
  const postGridItemsInRow = useBreakpointMatcher()

  const allPartners = VOLUNTEERING_IMG_SOURCES_MAPPING
  const { show: showPartnerModal, hide: closeModal, visible: partnerModalVisible } = useModalState()

  // TODO: Include Pagination with onScroll
  const {
    loading,
    data: engagements,
    error,
    totalResults,
    fetchNextPage,
    canFetchMore,
  } = usePaginationQuery<VolunteeringEngagement>(volunteeringEngagementsQuery, {
    queryPath: 'appVolunteering_engagementOpportunities',
    pageSize: ENGAGEMENT_PAGE_SIZE,
    variables: {
      location: isFiltering ? filters.location : undefined,
      category: isFiltering ? filters.category : undefined,
    },
    skip: filterError,
    fetchPolicy: 'cache-and-network',
    onError: (error) =>
      logError(error, 'Failed to load volunteering engagements', {
        location: 'VolunteeringListing.VolunteeringEngagementsQuery',
      }),
  })

  if (loading || loadingFilters) {
    return <VolunteeringListingSkeleton isFiltering={isFiltering} amount={ENGAGEMENT_PAGE_SIZE} />
  }

  const noResults = error || filterError || engagements.length === 0

  const handleCardPress = (engagement: VolunteeringEngagement) => {
    navigate(`/apps/volunteering/engagement/${engagement.id}`)
  }

  const listFooter = canFetchMore ? (
    <HoliButtonLoading
      type="primary"
      label={t('volunteering:listing.loadMoreButton.text')}
      loadingLabel={t('global.loading')}
      onPress={fetchNextPage}
      style={[styles.loadMoreButton]}
      testID="btn-volunteering-list-load-more"
    />
  ) : (
    <></>
  )

  return (
    <View style={[mixins.container, styles.list]}>
      {engagements.length > 0 && (
        <View>
          <HoliHeading level="1">{t('volunteering:listing.headline')}</HoliHeading>
          <HoliGap size="s" />
          <PartnerInfoRow
            rowText={t('volunteering:listing.subline')}
            showOutlinkIcon={false}
            partners={allPartners}
            onPress={showPartnerModal}
          />
          <PartnerModal
            headline={t('volunteering:listing.partnerModal.headline')}
            partners={allPartners}
            show={partnerModalVisible}
            onDismiss={closeModal}
            i18nNamespace={'volunteering'}
          />

          {isFiltering && (
            <View style={styles.headingRow}>
              <HoliText bold style={{ color: colors.foreground20 }}>
                {t('volunteering:filter.result', {
                  count: totalResults,
                })}
              </HoliText>
            </View>
          )}
        </View>
      )}
      <HoliBox padding={[24, 0, 24, 0]}>
        {noResults && (
          <View style={mixins.container}>
            <HoliNoResults
              firstText={t('global.noSearchResults')}
              media={
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
                  width={152}
                  height={152}
                  label=""
                  isSvg
                />
              }
              secondText={t('volunteering:filter.notFound.description')}
            >
              <HoliButton label={t('search.filter.reset')} onPress={clearFilters}>
                {t('search.filter.reset')}
              </HoliButton>
            </HoliNoResults>
          </View>
        )}
        <View testID={isFiltering ? 'volunteering-list-filtered' : 'volunteering-list-unfiltered'}>
          <HoliGridWrapper itemsInRow={postGridItemsInRow}>
            {engagements.map((engagement) => (
              <HoliGridCell key={engagement.id}>
                <HoliCard
                  key={engagement.id}
                  imageUrl={engagement.imageUrl}
                  imageLabel={engagement.title ?? ''}
                  imageWidth={imageWidth}
                  testID="btn-to-volunteering-engagement"
                  onCardPress={() => handleCardPress(engagement)}
                >
                  <VolunteeringCardContent engagement={engagement} key={engagement.id} />
                </HoliCard>
              </HoliGridCell>
            ))}
          </HoliGridWrapper>
        </View>
      </HoliBox>
      {listFooter}
    </View>
  )
}

export default withProfiler(VolunteeringListing, { name: 'VolunteeringListing' })

const getStyles = (bottomInset = 0) =>
  StyleSheet.create({
    list: {
      paddingTop: dimensions.topBarHeight,
      backgroundColor: colors.background20,
    },
    loadMoreButton: {
      marginTop: 24,
      marginBottom: 48 + bottomInset,
    },
    headingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingTop: 16,
    },
  })
