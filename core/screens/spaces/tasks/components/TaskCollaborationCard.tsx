import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import { Space } from '@holi/core/screens/spaces/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

interface TasksCardProps {
  isAdmin: boolean
  space: Space
}

const TasksCard: React.FC<TasksCardProps> = ({ isAdmin, space }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const cardProps = {
    headerRightIcon: isAdmin ? 'add' : undefined,
    onPressHeaderRight: isAdmin ? () => navigate(`/spaces/${space.name}/tasks/create`) : undefined,
    headerRightButtonLabel: isAdmin ? t('spaces.createTask.button') : undefined,
  }

  return (
    <CollaboratorAreaCard
      headerLeftIcon="checkbox"
      title={t('spaces.spaceDetails.tasks.header.title')}
      testID="space-tasks-card"
      {...cardProps}
    >
      {space.tasks?.length ? (
        <View style={styles.tasksListContainer}>
          <SpaceTaskList space={space} isAdmin={isAdmin} />
        </View>
      ) : (
        <View style={styles.empty}>
          <HoliText size={'small'} style={styles.emptyMessage}>
            {t('spaces.spaceDetails.tasks.empty.message.forCreators')}
          </HoliText>
          {isAdmin && (
            <HoliText size={'small'} style={styles.instruction}>
              {t('spaces.spaceDetails.tasks.empty.instruction')}
            </HoliText>
          )}
        </View>
      )}
    </CollaboratorAreaCard>
  )
}

export default TasksCard

const styles = StyleSheet.create({
  tasksListContainer: {
    padding: 8,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 24,
  },
  emptyMessage: {
    textAlign: 'center',
    color: colors.foreground20,
  },
  instruction: {
    marginTop: 12,
    color: colors.foreground30,
  },
})
