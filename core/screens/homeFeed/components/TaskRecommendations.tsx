import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import RecoSlider from '@holi/core/components/RecoSlider'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import TaskRecommendation from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile/TaskRecommendation'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { useRecommendedTasksQuery, type Task } from '@holi/api/graphql/graphql-codegen'
import { StarSmile } from '@holi/icons/src/generated'

type TaskRecommendationsProps = {
  cardWidth: number
}

const TaskRecommendations = ({ cardWidth }: TaskRecommendationsProps) => {
  const { t } = useTranslation()
  const styles = useMemo(() => getStyles(cardWidth), [cardWidth])

  const {
    data: taskData,
    loading: isLoadingTasks,
    error: tasksError,
    refetch,
  } = useRecommendedTasksQuery({
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
      name="tasks"
      viewTrackingParams={{
        listItemTrackingEvent,
        listItemIdentifier,
      }}
      renderItem={({ item, index }) => {
        return item.space ? (
          <View
            style={[styles.cardContainer, index === (tasks?.length || 0) - 1 && styles.lastCard]}
            testID={'tasks-reco-slider-card'}
          >
            <TaskRecommendation
              task={item}
              space={item.space}
              cardWidth={cardWidth}
              trackingEvent={TrackingEvent.RecommendationPressed('space_task', item.id, index)}
            />
          </View>
        ) : null
      }}
      data={tasks}
      icon={StarSmile}
      heading={t('recommendations.tasks.title')}
      subline={t('recommendations.tasks.subline')}
    />
  )
}

export default withProfiler(TaskRecommendations, { name: 'TaskRecommendations' })

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    cardContainer: {
      width: cardWidth,
    },
    lastCard: {
      marginRight: 44,
    },
  })
