import { useQuery } from '@apollo/react-hooks'
import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { RecommendedTasksQueryResponse, recommendedTasksQuery } from '@holi/core/screens/homeFeed/queries'
import Recommendation from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile/Recommendation'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'

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

  const isReloadingTasks = useRefetchOnClientSideForLoggedInWebUser(recommendedTasksQuery, { variables: { limit: 5 } })

  if (tasksError) {
    logError(tasksError, 'Could not query tasks', { location: 'TaskRecommendations' })
  }

  if (!taskData || isLoadingTasks || isReloadingTasks) return null

  const tasks = taskData?.recommendedTasks.data ?? []

  return (
    <View style={styles.container}>
      <HoliBox padding={[0, 0, 20, 0]}>
        <HoliHeading level="2">{t('recommendations.tasks.title')}</HoliHeading>
      </HoliBox>

      <FlatList
        horizontal
        style={styles.listContainer}
        data={tasks}
        renderItem={({ item, index }) => {
          return item.space ? (
            <View style={[styles.cardContainer, index === (tasks?.length || 0) - 1 && styles.lastCard]}>
              <Recommendation task={item} space={item.space} cardWidth={cardWidth} />
            </View>
          ) : null
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

export default withProfiler(TaskRecommendations, { name: 'TaskRecommendations' })

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
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
      width: cardWidth,
    },
    cardFooter: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
      gap: 3,
    },
    lastCard: {
      marginRight: 44,
    },
    moreCard: {
      flex: 1,
      width: cardWidth,
      marginRight: 44,
    },
  })
