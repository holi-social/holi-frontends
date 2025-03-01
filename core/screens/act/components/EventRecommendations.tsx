import React from 'react'
import RecoSlider from '@holi/core/components/RecoSlider'
import { TrackingEvent } from '@holi/core/tracking'
import { CheckboxFilled } from '@holi/icons/src/generated'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { ListItemTrackingEvent, ListItemIdentifier } from '@holi/core/tracking/TrackableFlatList.shared'
import { useQuery } from '@apollo/client'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { type RecommendedTasksQueryResponse, recommendedTasksQuery } from '@holi/core/screens/homeFeed/queries'
import type { Task } from '@holi/core/screens/spaces/types'
import EventRecommendation from '@holi/core/screens/act/components/EventRecommendation'
import { Spacing } from 'holi-bricks/tokens'

type EventRecommendationsProps = {
  cardWidth: number
}

const EventRecommendations = ({ cardWidth }: EventRecommendationsProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const {
    data: taskData,
    loading: isLoadingTasks,
    error: tasksError,
    refetch,
  } = useQuery<RecommendedTasksQueryResponse>(recommendedTasksQuery, {
    variables: { limit: 5 },
    onError: (error) => logError(error, 'Failed to load recommendedTasks', { location: 'TaskRecommendations' }),
  })
  useOnRefresh(refetch)

  if (tasksError) {
    logError(tasksError, 'Could not query tasks', { location: 'TaskRecommendations' })
  }

  if (!taskData || isLoadingTasks) return null

  const tasks = taskData?.recommendedTasks.data ?? []

  const listItemTrackingEvent: ListItemTrackingEvent<Task> = ({ name, id }) => {
    return TrackingEvent.RecommendationViewed('space_task', { name, id })
  }

  const listItemIdentifier: ListItemIdentifier<Task> = ({ id }) => {
    return id
  }

  return (
    <RecoSlider
      name="events"
      viewTrackingParams={{
        listItemTrackingEvent,
        listItemIdentifier,
      }}
      renderItem={({ item, index }) => {
        return item.space ? (
          <View
            style={[styles.cardContainer(cardWidth), index === (tasks?.length || 0) - 1 && styles.lastCard]}
            testID={'tasks-reco-slider-card'}
          >
            <EventRecommendation
              task={item}
              space={item.space}
              trackingEvent={TrackingEvent.RecommendationPressed('space_task', item.id, index)}
            />
          </View>
        ) : null
      }}
      data={tasks}
      icon={CheckboxFilled}
      heading={t('act.events.title')}
      subline={t('act.events.subline')}
      cardWidth={cardWidth}
    />
  )
}

export default EventRecommendations

const stylesheet = createStyleSheet(() => ({
  cardContainer: (cardWidth: number) => ({
    marginRight: Spacing.xxs,
    width: cardWidth,
  }),
  lastCard: {
    marginRight: 44,
  },
}))
