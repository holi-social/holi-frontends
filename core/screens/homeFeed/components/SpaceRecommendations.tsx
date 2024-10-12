import { QueryHookOptions } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { SpaceCardFragment, useSpaceRecommendationQuery } from '@holi/api/graphql/graphql-codegen'
import RecoSlider from '@holi/core/components/RecoSlider'
import { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { HoliLinkTracked } from '@holi/core/navigation/components/HoliLinkTracked'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { TrackingEvent } from '@holi/core/tracking'
import { SpacesFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'

interface SpaceRecommendationProps {
  space: SpaceCardFragment
  trackingEvent: TrackingEvent
  cardWidth: number
}

const SpaceRecommendation = ({ space, trackingEvent, cardWidth }: SpaceRecommendationProps) => {
  const styles = useMemo(() => getStyles(cardWidth), [cardWidth])

  return (
    <View style={styles.cardContainer}>
      <HoliLinkTracked label={space.title} href={`/spaces/${space.name}`} isFullHeight trackingEvent={trackingEvent}>
        <HoliCard
          hasBorder
          key={space.id}
          imageLabel={space.title}
          imageUri={space.cover}
          imageWidth={cardWidth}
          caption={
            <HoliUserAvatarPile
              // FIXME: necessary cast until we update the HoliUserAvatarPile with types from `graphql-codegen`
              users={space.members.data.map((membership) => membership.user) as unknown as User[]}
              usersToShow={3}
              usersTotal={space.members.totalResults}
              counter
              collapse
              hasBackground
            >
              <HoliText>{space.members.totalResults}</HoliText>
            </HoliUserAvatarPile>
          }
        >
          <View style={styles.cardFooter}>
            {!!space.location && (
              <HoliText size="small" color="brandB300" bold selectable>
                {space.location}
              </HoliText>
            )}
            <HoliHeading level="2" size="s" numberOfLines={2} selectable>
              {space.title}
            </HoliHeading>
            <HoliText numberOfLines={2} selectable>
              {space.description}
            </HoliText>
          </View>
        </HoliCard>
      </HoliLinkTracked>
    </View>
  )
}

type SpaceRecommendationsProps = {
  cardWidth: number
}

const SpaceRecommendations = ({ cardWidth }: SpaceRecommendationsProps) => {
  const { t } = useTranslation()

  const queryOptions: QueryHookOptions = {
    variables: { limit: 5 },
  }
  const {
    data: spaceData,
    loading: isLoadingSpace,
    error: spaceError,
    refetch,
  } = useSpaceRecommendationQuery(queryOptions)
  useOnRefresh(refetch)

  if (spaceError) {
    logError(spaceError, 'Recommended Spaces rendering error', { location: 'SpaceRecommendations' })
  }

  if (!spaceData || isLoadingSpace) return null

  const spaces = spaceData.recommendedSpaces.data
  const seeMoreText = t('recommendations.spaces.seeMore')

  return (
    <RecoSlider
      name="spaces"
      renderItem={({ item, index }) => (
        <SpaceRecommendation
          space={item}
          trackingEvent={TrackingEvent.RecommendationPressed('space', item.id, index)}
          cardWidth={cardWidth}
        />
      )}
      data={spaces}
      icon={SpacesFilled}
      heading={t('recommendations.spaces.title')}
      subline={t('recommendations.spaces.subline')}
      seeAllPath="/spaces?tab=discover"
      labelSeeMore={seeMoreText}
      cardWidth={cardWidth}
    />
  )
}

export default withProfiler(SpaceRecommendations, { name: 'SpaceRecommendations' })

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    cardContainer: {
      marginRight: 12,
      width: cardWidth,
    },
    cardFooter: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
      gap: 3,
    },
  })
