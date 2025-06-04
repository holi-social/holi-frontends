import { Text, TextLink } from 'holi-bricks/components/text'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, type ListRenderItem, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import type { TrackableFlatListParams } from '@holi/core/tracking/TrackableFlatList.shared'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import ExploreMoreCard from '@holi-apps/challenges/components/feed/ExploreMoreCard'
import type { ChallengeTeaser } from '@holi-apps/challenges/components/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { Stack } from 'holi-bricks/components/stack'

type ChallengesSliderProps = {
  heading: string
  challenges: readonly ChallengeTeaser[]
  renderItem: ListRenderItem<ChallengeTeaser>
  seeAllPath: string
  labelSeeMore?: string
  cardWidth?: number
  viewTrackingParams?: TrackableFlatListParams
}

const ChallengesSlider: React.FC<ChallengesSliderProps> = ({
  heading,
  challenges,
  renderItem,
  seeAllPath,
  labelSeeMore,
  cardWidth = 130,
  viewTrackingParams,
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { track } = useTracking()

  const handleHeaderTitlePress = () => {
    track(TrackingEvent.ChallengeCard.AllChallengesVisited('home', 'title-bar'))
    navigate(seeAllPath)
  }

  const handleMoreCardPress = () => {
    track(TrackingEvent.ChallengeCard.AllChallengesVisited('home', 'more-card'))
    navigate(seeAllPath)
  }

  const listProps = {
    horizontal: true,
    style: styles.itemsContainer,
    data: challenges,
    renderItem,
    ItemSeparatorComponent: () => <HoliGap size="sm" />,
    testID: 'challenges-slider-list',
    ListFooterComponent: labelSeeMore ? (
      <View style={{ width: cardWidth }}>
        <ExploreMoreCard role="link" label={labelSeeMore} onPress={handleMoreCardPress}>
          {labelSeeMore}
        </ExploreMoreCard>
      </View>
    ) : null,
  }

  const ListComponent = viewTrackingParams ? (
    <TrackableFlatList {...listProps} {...viewTrackingParams} />
  ) : (
    <FlatList {...listProps} />
  )

  return (
    <HoliContainer noPadding>
      <Stack
        direction="row"
        gap="xxs"
        justifyContent="space-between"
        margin={{ bottom: '4xs' }}
        onPress={handleHeaderTitlePress}
      >
        <Text size="xl" headingLevel="3">
          {heading}
        </Text>
        <TextLink size="md" role="none">
          {t('global.learnMore')}
        </TextLink>
      </Stack>
      {ListComponent}
    </HoliContainer>
  )
}

export default ChallengesSlider

const styles = StyleSheet.create({
  itemsContainer: {
    paddingBottom: 0,
    flex: 1,
  },
})
