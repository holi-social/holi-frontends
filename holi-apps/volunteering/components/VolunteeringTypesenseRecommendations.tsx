import React, { useMemo } from 'react'

import { ENGAGEMENT_PAGE_SIZE } from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import VolunteeringListingSkeleton from '@holi-apps/volunteering/components/VolunteeringListingSkeleton'
import { View } from 'react-native'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { TrackingEvent } from '@holi/core/tracking'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import VolunteeringCardContent from '@holi-apps/volunteering/components/VolunteeringCardContent'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { VolunteeringListingHeader } from '@holi-apps/volunteering/components/VolunteeringListingHeader'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { useVolunteeringRecosTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense'

export const VolunteeringTypesenseRecommendations = () => {
  const mixins = useStyleMixins()
  const { styles } = useStyles(stylesheet)
  const { imageWidth } = useWindowDimensionsWithImageScaling()

  const { isLoading, engagements, canFetchMore, fetchNextPage } = useVolunteeringRecosTypesense({ displayErrors: true })

  const loadMoreComponent = useMemo(() => {
    return (
      <ScrollBasedCallbackInvocation
        callback={fetchNextPage}
        placeholder={<HoliLoader style={styles.loaderBottom} testID="volunteering-loader" />}
      />
    )
  }, [fetchNextPage, styles.loaderBottom])

  if (isLoading && !engagements.length) {
    return <VolunteeringListingSkeleton amount={ENGAGEMENT_PAGE_SIZE} />
  }

  return (
    <View style={[mixins.container, styles.list]}>
      {engagements.length > 0 && <VolunteeringListingHeader isFiltering={false} filterSubtitle="" />}
      <HoliBox padding={[24, 0, 24, 0]}>
        <View testID={'volunteering-list-unfiltered'}>
          <HoliGridWrapper>
            {engagements.map((engagement, index) => {
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
                      imageLabel={engagement.title}
                      imageWidth={imageWidth}
                      testID="btn-to-volunteering-engagement"
                    >
                      <VolunteeringCardContent engagementOrReco={engagement} key={engagement.id} />
                    </HoliCard>
                  </HoliLinkTracked>
                </HoliGridCell>
              )
            })}
          </HoliGridWrapper>
        </View>
      </HoliBox>
      {canFetchMore && loadMoreComponent}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  list: {
    paddingTop: dimensions.topBarHeight,
    backgroundColor: theme.colors.bg.main,
  },
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
}))
