import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import { SpaceCardFragment, useSpaceRecommendationQuery } from '@holi/api/graphql/graphql-codegen'
import { logError } from '@holi/core/errors/helpers'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
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
}

const SpaceRecommendation = ({ space }: SpaceRecommendationProps) => {
  return (
    <View style={styles.cardContainer}>
      <HoliLink label={space.title} href={`/spaces/${space.name}`} isFullHeight>
        <HoliCard
          hasBorder
          key={space.id}
          imageLabel={space.title}
          imageUrl={space.cover}
          imageWidth={IMAGE_WIDTH}
          imageHeight={IMAGE_HEIGHT}
          caption={
            <HoliUserAvatarPile
              // FIXME: necesary cast until we update the HoliUserAvatarPile with types from `graphql-codegen`
              users={space.members.data.map((membership) => membership.user) as unknown as User[]}
              usersToShow={3}
              usersTotal={space.members.totalResults}
              counter
              collapse
              hasBackground
            />
          }
        >
          <View style={styles.cardFooter}>
            {!!space.location && (
              <HoliText size="small" color="brandB300" bold selectable>
                {space.location}
              </HoliText>
            )}
            <HoliHeading level="2" selectable size="s" numberOfLines={3}>
              {space.title}
            </HoliHeading>
            <HoliText selectable>{space.description}</HoliText>
          </View>
        </HoliCard>
      </HoliLink>
    </View>
  )
}

const getTopicIds = (user: User | undefined, isLoggedIn: boolean) => {
  if (!user || !user.interests || !isLoggedIn) return []
  return user.interests.map((interest) => interest.id)
}

const SpaceRecommendations = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { user, isLoggedIn, isLoading: isLoadingUser } = useLoggedInUser()

  const {
    data: spaceData,
    loading: isLoadingSpace,
    error: spaceError,
  } = useSpaceRecommendationQuery({
    variables: { topicIds: getTopicIds(user, isLoggedIn), limit: 5 },
  })

  if (spaceError) {
    logError('Recommended Spaces rendering error', spaceError.message, { location: 'SpaceRecommendations' })
  }

  if (!spaceData || isLoadingUser || isLoadingSpace) return null

  const spaces = spaceData.recommendedSpaces.data
  const seeMoreText = t('recommendations.spaces.seeMore')

  return (
    <HoliBox padding={[24, 0, 40, 0]}>
      <HoliBox padding={[0, 0, 20, 0]}>
        <HoliHeading level="2">{t('recommendations.spaces.title')}</HoliHeading>
      </HoliBox>

      <FlatList
        horizontal
        style={styles.listContainer}
        data={spaces}
        renderItem={({ item }) => <SpaceRecommendation space={item} />}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={styles.moreCard}>
            <HoliMoreCard role="link" label={seeMoreText} onPress={() => navigate('/spaces')}>
              {seeMoreText}
            </HoliMoreCard>
          </View>
        }
      />
    </HoliBox>
  )
}

export default withProfiler(SpaceRecommendations, { name: 'SpaceRecommendations' })

const styles = StyleSheet.create({
  listContainer: {
    marginRight: -20,
  },
  cardContainer: {
    marginRight: 12,
    width: CARD_WIDTH,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 3,
  },
  moreCard: {
    flex: 1,
    width: CARD_WIDTH,
  },
})
