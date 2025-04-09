import React, { useMemo } from 'react'

import { ENGAGEMENT_PAGE_SIZE } from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
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
import { transformTypesenseDocumentToEngagement } from '@holi-apps/volunteering/helpers/transformTypesenseDocumentToEngagement'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import { useVolunteeringRecoTypesenseParameters } from '@holi-apps/volunteering/hooks/useVolunteeringRecoTypesenseParameters'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'

export const VolunteeringTypesenseRecommendations = () => {
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()
  const { styles } = useStyles(stylesheet)
  const language = useUserLanguage()
  const { imageWidth } = useWindowDimensionsWithImageScaling()

  const { isLoadingParameters, parameters } = useVolunteeringRecoTypesenseParameters({
    pageSize: ENGAGEMENT_PAGE_SIZE,
    onGeolocationError: (error) => {
      displayError(error, 'Error retrieving geolocation', {
        location: 'VolunteeringTypesenseRecommendations.useVolunteeringRecoTypesenseParameters',
      })
    },
  })

  const { state, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    skip: isLoadingParameters,
    onError: (error) => {
      displayError(error, 'Error retrieving recommendations', {
        location: 'VolunteeringTypesenseRecommendations.useTypesensePaginationQuery',
      })
    },
  })

  useOnRefresh(refetch)

  const loadMoreComponent = useMemo(() => {
    return (
      <ScrollBasedCallbackInvocation
        callback={fetchNextPage}
        placeholder={<HoliLoader style={styles.loaderBottom} testID="volunteering-loader" />}
      />
    )
  }, [fetchNextPage, styles.loaderBottom])

  if ((state.isLoading || isLoadingParameters) && !state.data.length) {
    return <VolunteeringListingSkeleton amount={ENGAGEMENT_PAGE_SIZE} />
  }
  const engagements = state.data.map((engagement) => transformTypesenseDocumentToEngagement(engagement, language))

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
                      <VolunteeringCardContent engagementOrReco={engagement} key={engagement.id} />
                    </HoliCard>
                  </HoliLinkTracked>
                </HoliGridCell>
              )
            })}
          </HoliGridWrapper>
        </View>
      </HoliBox>
      {state.canFetchMore && loadMoreComponent}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  list: {
    paddingTop: dimensions.topBarHeight,
    backgroundColor: theme.colors.bg.page,
  },
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
}))
