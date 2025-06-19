import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import SpaceTaskList from '@holi/core/screens/spaces/tasks/components/SpaceTaskList'
import type { Space } from '@holi/api/graphql/graphql-codegen'
import { Add, Checkbox } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface TasksCardProps {
  isAdmin: boolean
  isCollaborator: boolean
  space: Space
  showNoResults?: boolean
}

const TasksCard: React.FC<TasksCardProps> = ({ isAdmin, isCollaborator, space, showNoResults }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const isMember = isAdmin || isCollaborator
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const cardProps = {
    headerRightIcon: isMember ? Add : undefined,
    onPressHeaderRight: isMember ? () => navigateToCreateTask() : undefined,
    headerRightButtonLabel: isMember ? t('spaces.createTask.button') : undefined,
  }

  const navigateToCreateTask = () => navigate(`/spaces/${space.name}/tasks/create`)
  const navigateToTasks = () => navigate(`/spaces/${space.name}/tasks`)

  if (!space.tasks?.length && !isAdmin && !isCollaborator && showNoResults) {
    return (
      <HoliNoResults
        firstText={t('spaces.spaceDetails.tasks.empty.title.forNonMembers')}
        secondText={t('spaces.spaceDetails.tasks.empty.message.forNonMembers')}
        media={
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_no_actions_available.svg')}
            label=""
            height={203}
            width={279}
            isSvg
          />
        }
      />
    )
  }

  if (!space.tasks?.length && !isAdmin && !isCollaborator && !showNoResults) {
    return <></>
  }

  return (
    <CollaboratorAreaCard
      headerLeftIcon={isCollaborator ? Checkbox : undefined}
      title={t('spaces.spaceDetails.tasks.header.title')}
      testID="space-tasks-card"
      {...cardProps}
      onPressHeaderLeft={() => navigateToTasks()}
      onPressHeaderRight={() => navigateToCreateTask()}
      isCollaborator={isCollaborator}
      style={!isCollaborator ? styles.container : {}}
    >
      {!!space.tasks?.length && (
        <View style={styles.tasksListContainer}>
          <SpaceTaskList space={space} isCollaborator={isCollaborator} preview />
        </View>
      )}

      {!space.tasks?.length && (isCollaborator || isAdmin) && (
        <View style={styles.empty}>
          <HoliText size={'small'} style={styles.emptyMessage}>
            {t('spaces.spaceDetails.tasks.empty.message.forCreators')}
          </HoliText>
          {isMember && (
            <HoliButton label={t('spaces.global.empty.instruction')} transparent onPress={navigateToCreateTask}>
              <HoliText size="small" style={styles.instruction}>
                {t('spaces.global.empty.instruction')}
              </HoliText>
            </HoliButton>
          )}
        </View>
      )}
    </CollaboratorAreaCard>
  )
}

export default TasksCard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
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
      color: theme.colors.foreground20,
    },
    instruction: {
      color: theme.colors.foreground30,
      alignSelf: 'center',
      paddingTop: 12,
    },
  })
