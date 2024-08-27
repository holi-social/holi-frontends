import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import InfoModal from '@holi/core/components/InfoModal'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
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
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

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
  const { loading, data: engagements, totalResults } = usePaginationContext<VolunteeringEngagement>()
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(insets.bottom, theme), [insets.bottom, theme])

  const { imageWidth } = useWindowDimensionsWithImageScaling()

  const allPartners = VOLUNTEERING_IMG_SOURCES_MAPPING
  const { show: showPartnerModal, hide: closeModal, visible: partnerModalVisible } = useModalState()

  const noResults = loadingFailed || engagements.length === 0

  if (loading) {
    return <VolunteeringListingSkeleton isFiltering={isFiltering} amount={ENGAGEMENT_PAGE_SIZE} />
  }

  return (
    <View style={[mixins.container, styles.list]}>
      {engagements.length > 0 && (
        <View>
          <HoliHeading level="2" size="l">
            {t('volunteering:listing.headline')}
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
          <HoliGridWrapper>
            {engagements.map((engagement) => (
              <HoliGridCell key={engagement.id}>
                <HoliLink href={`/volunteering/${engagement.id}`} label={engagement.title}>
                  <HoliCard
                    imageUri={engagement.imageUrl}
                    imageLabel={engagement.title ?? ''}
                    imageWidth={imageWidth}
                    testID="btn-to-volunteering-engagement"
                  >
                    <VolunteeringCardContent engagement={engagement} key={engagement.id} />
                  </HoliCard>
                </HoliLink>
              </HoliGridCell>
            ))}
          </HoliGridWrapper>
        </View>
      </HoliBox>
    </View>
  )
}

const getStyles = (bottomInset = 0, theme: HoliTheme) =>
  StyleSheet.create({
    list: {
      paddingTop: dimensions.topBarHeight,
      backgroundColor: theme.colors.background20,
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
