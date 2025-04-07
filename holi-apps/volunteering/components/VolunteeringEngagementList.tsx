import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { TrackingEvent } from '@holi/core/tracking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringCardContent from '@holi-apps/volunteering/components/VolunteeringCardContent'
import VolunteeringListingSkeleton from '@holi-apps/volunteering/components/VolunteeringListingSkeleton'

import type { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'
import { Button } from 'holi-bricks/components/button'
import { VolunteeringListingHeader } from '@holi-apps/volunteering/components/VolunteeringListingHeader'

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
  const styles = useMemo(() => getStyles(theme), [theme])

  const { imageWidth } = useWindowDimensionsWithImageScaling()

  const noResults = loadingFailed || engagements.length === 0

  if (engagementsLoading) {
    return <VolunteeringListingSkeleton isFiltering={isFiltering} amount={ENGAGEMENT_PAGE_SIZE} />
  }

  return (
    <View style={[mixins.container, styles.list]}>
      {engagements.length > 0 && (
        <VolunteeringListingHeader
          isFiltering={isFiltering}
          filterSubtitle={t('volunteering:filter.result', {
            count: totalResults,
          })}
        />
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
              <Button label={t('search.filter.reset')} onPress={clearFilters} />
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
                    label={engagement?.title as string}
                    trackingEvent={TrackingEvent.RecommendationPressed(
                      'volunteering_opportunity',
                      engagement.id as string,
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
