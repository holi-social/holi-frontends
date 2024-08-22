import { QueryHookOptions } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import {
  SpaceCardFragment,
  SpaceRecommendationDocument,
  useSpaceRecommendationQuery,
} from '@holi/api/graphql/graphql-codegen'
import { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { HoliLinkTracked } from '@holi/core/navigation/components/HoliLinkTracked'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { TrackingEvent } from '@holi/core/tracking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'

const IMAGE_WIDTH = 480
const IMAGE_HEIGHT = 320
const CARD_WIDTH = 260

interface SpaceRecommendationProps {
  space: SpaceCardFragment
  trackingEvent: TrackingEvent
}

const SpaceRecommendation = ({ space, trackingEvent }: SpaceRecommendationProps) => {
  return (
    <View style={styles.cardContainer}>
      <HoliLinkTracked label={space.title} href={`/spaces/${space.name}`} isFullHeight trackingEvent={trackingEvent}>
        <HoliCard
          hasBorder
          key={space.id}
          imageLabel={space.title}
          imageUri={space.cover}
          imageWidth={IMAGE_WIDTH}
          imageHeight={IMAGE_HEIGHT}
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

const SpaceRecommendations = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const queryOptions: QueryHookOptions = {
    variables: { limit: 5 },
  }
  const { data: spaceData, loading: isLoadingSpace, error: spaceError } = useSpaceRecommendationQuery(queryOptions)
  const isReloadingSpace = useRefetchOnClientSideForLoggedInWebUser(SpaceRecommendationDocument, queryOptions)

  if (spaceError) {
    logError(spaceError, 'Recommended Spaces rendering error', { location: 'SpaceRecommendations' })
  }

  if (!spaceData || isLoadingSpace || isReloadingSpace) return null

  const spaces = spaceData.recommendedSpaces.data
  const seeMoreText = t('recommendations.spaces.seeMore')

  return (
    <View style={styles.container}>
      <HoliBox padding={[0, 0, 20, 0]}>
        <HoliHeading level="2">{t('recommendations.spaces.title')}</HoliHeading>
      </HoliBox>

      <FlatList
        horizontal
        style={styles.listContainer}
        data={spaces}
        renderItem={({ item, index }) => (
          <SpaceRecommendation
            space={item}
            trackingEvent={TrackingEvent.RecommendationPressed('space', item.id, index)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={styles.moreCard}>
            <HoliMoreCard role="link" label={seeMoreText} onPress={() => navigate('/spaces?tab=discover')}>
              {seeMoreText}
            </HoliMoreCard>
          </View>
        }
      />
    </View>
  )
}

export default withProfiler(SpaceRecommendations, { name: 'SpaceRecommendations' })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 10,
  },
  listContainer: {
    flex: 1,
    paddingLeft: 24,
    paddingBottom: 12,
    marginHorizontal: -20,
  },
  cardContainer: {
    marginRight: 12,
    width: CARD_WIDTH,
  },
  cardFooter: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 3,
  },
  moreCard: {
    flex: 1,
    width: CARD_WIDTH,
    marginRight: 44,
  },
})
