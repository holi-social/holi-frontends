import { useQuery } from '@apollo/react-hooks'
import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import RecoSlider from '@holi/core/components/RecoSlider'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { RecommendedTasksQueryResponse, recommendedTasksQuery } from '@holi/core/screens/homeFeed/queries'
import TaskRecommendation from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile/TaskRecommendation'
import { TrackingEvent } from '@holi/core/tracking'
import CheckboxFilled from '@holi/icons/src/generated/CheckboxFilled'

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

  return (
    <RecoSlider
      name="tasks"
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
      icon={CheckboxFilled}
      heading={t('recommendations.tasks.title')}
      subline={t('recommendations.tasks.subline')}
      cardWidth={cardWidth}
    />
  )
}

export default withProfiler(TaskRecommendations, { name: 'TaskRecommendations' })

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    cardContainer: {
      marginRight: 12,
      width: cardWidth,
    },
    lastCard: {
      marginRight: 44,
    },
  })
