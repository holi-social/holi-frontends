import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import InfoModal from '@holi/core/components/InfoModal'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { TrackingEvent } from '@holi/core/tracking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'
import VolunteeringCardContent from '@holi-apps/volunteering/components/VolunteeringCardContent'
import VolunteeringListingSkeleton from '@holi-apps/volunteering/components/VolunteeringListingSkeleton'
import { VOLUNTEERING_IMG_SOURCES_MAPPING } from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'
import { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'

export const ENGAGEMENT_PAGE_SIZE = 10

interface VolunteeringEngagementListProps {
  isFiltering?: boolean
  loadingFailed?: boolean
  clearFilters?: () => void
}

export const VolunteeringEngagementList = ({
  loadingFailed = false,
  isFiltering = false,
  clearFilters,
}: VolunteeringEngagementListProps) => {
  const {
    loading: engagementsLoading,
    data: engagements,
    totalResults,
  } = usePaginationContext<VolunteeringEngagement | VolunteeringReco>()
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const subtitle = useRecosSubtitle()

  const { imageWidth } = useWindowDimensionsWithImageScaling()

  const allPartners = VOLUNTEERING_IMG_SOURCES_MAPPING
  const { show: showPartnerModal, hide: closeModal, visible: partnerModalVisible } = useModalState()

  const noResults = loadingFailed || engagements.length === 0

  if (engagementsLoading) {
    return <VolunteeringListingSkeleton isFiltering={isFiltering} amount={ENGAGEMENT_PAGE_SIZE} />
  }

  return (
    <View style={[mixins.container, styles.list]}>
      {engagements.length > 0 && (
        <View>
          <HoliHeading level="2" size="l">
            {t('volunteering:discoveryV1.headline')}
          </HoliHeading>
          <HoliGap size="s" />
          <PartnerInfoRow
            rowText={t('volunteering:listing.subline')}
            showOutlinkIcon={false}
            partners={allPartners}
            onPress={showPartnerModal}
          />
          <InfoModal
            headline={t('volunteering:listing.partnerModal.headline')}
            items={allPartners}
            show={partnerModalVisible}
            onDismiss={closeModal}
            i18nPrefix={'volunteering:listing.partnerModal'}
          />
          {isFiltering ? (
            <View style={styles.headingRow}>
              <HoliText bold style={{ color: colors.foreground20 }}>
                {t('volunteering:filter.result', {
                  count: totalResults,
                })}
              </HoliText>
            </View>
          ) : (
            <>
              <HoliGap size="ml" />
              <HoliText size="large">{t(subtitle)}</HoliText>
            </>
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
          <HoliGridWrapper>
            {engagements.map((engagementOrReco, index) => {
              const isReco = 'engagement' in engagementOrReco
              const engagement = isReco ? engagementOrReco.engagement : engagementOrReco
              return (
                <HoliGridCell key={engagement.id}>
                  <HoliLinkTracked
                    href={`/volunteering/${engagement.id}`}
                    label={engagement.title}
                    trackingEvent={TrackingEvent.RecommendationPressed(
                      'volunteering_opportunity',
                      engagement.id,
                      index
                    )}
                  >
                    <HoliCard
                      loading={false}
                      imageUri={engagement.imageUrl}
                      imageLabel={engagement.title ?? ''}
                      imageWidth={imageWidth}
                      testID="btn-to-volunteering-engagement"
                    >
                      <VolunteeringCardContent engagementOrReco={engagementOrReco} key={engagement.id} />
                    </HoliCard>
                  </HoliLinkTracked>
                </HoliGridCell>
              )
            })}
          </HoliGridWrapper>
        </View>
      </HoliBox>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    list: {
      paddingTop: dimensions.topBarHeight,
      backgroundColor: theme.colors.background20,
    },
    headingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingTop: 16,
    },
  })
