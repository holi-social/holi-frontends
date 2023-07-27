import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import { Space } from '@holi/core/screens/spaces/types'
import { Add, Checkbox } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface TasksCardProps {
  isAdmin: boolean
  isCollaborator: boolean
  space: Space
}

const TasksCard: React.FC<TasksCardProps> = ({ isAdmin, isCollaborator, space }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const cardProps = {
    headerRightIcon: isAdmin ? Add : undefined,
    onPressHeaderRight: isAdmin ? () => navigateToCreateTask() : undefined,
    headerRightButtonLabel: isAdmin ? t('spaces.createTask.button') : undefined,
  }

  const navigateToCreateTask = () => navigate(`/spaces/${space.name}/tasks/create`)
  const navigateToTasks = () => navigate(`/spaces/${space.name}/tasks`)

  return (
    <CollaboratorAreaCard
      headerLeftIcon={Checkbox}
      title={t('spaces.spaceDetails.tasks.header.title')}
      testID="space-tasks-card"
      {...cardProps}
      onPressHeaderLeft={() => navigateToTasks()}
      onPressHeaderRight={() => navigateToCreateTask()}
    >
      {space.tasks?.length ? (
        <View style={styles.tasksListContainer}>
          <SpaceTaskList space={space} isAdmin={isAdmin} isCollaborator={isCollaborator} preview />
          {space.tasks && space.tasks.length > 2 && (
            <View style={styles.seeAllButtonContainer}>
              <HoliButton
                label={t('spaces.spaceDetails.tasks.seeAll')}
                onPress={() => navigateToTasks()}
                style={styles.seeAllButton}
                inline
                type="secondary"
              >
                <HoliText>{t('spaces.spaceDetails.tasks.seeAllButton.label')}</HoliText>
              </HoliButton>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.empty}>
          <HoliText size={'small'} style={styles.emptyMessage}>
            {t('spaces.spaceDetails.tasks.empty.message.forCreators')}
          </HoliText>
          {isAdmin && (
            <HoliButton
              label={t('spaces.spaceDetails.tasks.empty.instruction')}
              transparent
              onPress={navigateToCreateTask}
            >
              <HoliText size="small" style={styles.instruction}>
                {t('spaces.spaceDetails.tasks.empty.instruction')}
              </HoliText>
            </HoliButton>
          )}
        </View>
      )}
    </CollaboratorAreaCard>
  )
}

export default TasksCard

const styles = StyleSheet.create({
  seeAllButtonContainer: {
    alignItems: 'center',
  },
  seeAllButton: {
    bottom: 0,
    paddingHorizontal: 20,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  tasksListContainer: {
    padding: 8,
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 24,
    paddingBottom: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    color: colors.foreground20,
  },
  instruction: {
    color: colors.foreground30,
    alignSelf: 'center',
    paddingTop: 12,
  },
})
