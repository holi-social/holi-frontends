import { useQuery } from '@apollo/react-hooks'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
// import useRouting from '@holi/core/navigation/hooks/useRouting'
import { RecommendedTasksQueryResponse, recommendedTasksQuery } from '@holi/core/screens/homeFeed/queries'
import SpaceTaskTile from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'

// import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'

const CARD_WIDTH = 260

const TaskRecommendations = () => {
  const { t } = useTranslation()
  // const { navigate } = useRouting()

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
  // const seeMoreText = t('recommendations.spaces.seeMore')

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
              <SpaceTaskTile variant="recommendation" task={item} space={item.space} />
            </View>
          ) : null
        }}
        keyExtractor={(item) => item.id}
        // ListFooterComponent={
        //   <View style={styles.moreCard}>
        //     <HoliMoreCard role="link" label={seeMoreText} onPress={() => navigate('/spaces')}>
        //       {seeMoreText}
        //     </HoliMoreCard>
        //   </View>
        // }
      />
    </View>
  )
}

export default withProfiler(TaskRecommendations, { name: 'TaskRecommendations' })

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
  lastCard: {
    marginRight: 44,
  },
  moreCard: {
    flex: 1,
    width: CARD_WIDTH,
    marginRight: 44,
  },
})
