import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringCardContent from '@holi-apps/volunteering/components/VolunteeringCardContent'
import VolunteeringListingSkeleton from '@holi-apps/volunteering/components/VolunteeringListingSkeleton'

import { Button } from 'holi-bricks/components/button'
import { VolunteeringListingHeader } from '@holi-apps/volunteering/components/VolunteeringListingHeader'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { linkFromLocator } from '@holi/core/typesense/helpers/linkFromLocator'

export const ENGAGEMENT_PAGE_SIZE = 10

interface VolunteeringEngagementListProps {
  isFiltering?: boolean
  loadingFailed?: boolean
  clearFilters?: () => void
  engagements: LocalizedTypesenseDocument[]
  isLoading?: boolean
  totalResults?: number
  footerComponent?: React.ReactNode
}

export const VolunteeringEngagementList = ({
  loadingFailed = false,
  isFiltering = false,
  clearFilters,
  engagements,
  isLoading = false,
  totalResults = 0,
  footerComponent,
}: VolunteeringEngagementListProps) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const noResults = loadingFailed || engagements.length === 0

  if (isLoading && !engagements.length) {
    return <VolunteeringListingSkeleton isFiltering={isFiltering} amount={ENGAGEMENT_PAGE_SIZE} />
  }

  return (
    <View style={[mixins.container, styles.list]}>
      {engagements.length > 0 && <VolunteeringListingHeader isFiltering={isFiltering} totalResults={totalResults} />}
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
            {engagements.map((engagement, index) => {
              const link = linkFromLocator(engagement.type, engagement.link_locators)
              return (
                <HoliGridCell key={engagement.id}>
                  <HoliLinkTracked
                    href={link}
                    label={engagement?.title}
                    trackingEvent={TrackingEvent.RecommendationPressed(
                      engagement.type === 'task' ? 'space_task' : 'volunteering_opportunity',
                      engagement.id,
                      index
                    )}
                  >
                    <HoliCard
                      loading={false}
                      imageUri={engagement.image_url}
                      imageLabel={engagement.title}
                      // Workaround for fallback image to be displayed correctly
                      imageWidth={0}
                      testID="btn-to-volunteering-engagement"
                      imageFallback={require('@holi/ui/assets/img/illustrations/illustration_task.svg')}
                    >
                      <VolunteeringCardContent engagement={engagement} key={engagement.id} />
                    </HoliCard>
                  </HoliLinkTracked>
                </HoliGridCell>
              )
            })}
          </HoliGridWrapper>
        </View>
      </HoliBox>
      {footerComponent}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  list: {
    paddingTop: dimensions.topBarHeight,
    backgroundColor: theme.colors.bg.main,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 16,
  },
}))
