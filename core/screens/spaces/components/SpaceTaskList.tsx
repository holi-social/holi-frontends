import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import CollaboratorAreaCard from '@holi/core/screens/spaces/components/CollaborationAreaCard'
import LinkHubWidget from '@holi/core/screens/spaces/components/SpaceLinkHub/LinkHubWidget'
import StorageWidget from '@holi/core/screens/spaces/components/SpaceLinkHub/StorageWidget'
import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType, Task } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type SpaceTaskListProps = {
  style?: StyleProp<ViewStyle>
  space: Space
}

const SpaceTaskList: React.VFC<SpaceTaskListProps> = ({ space, style }: SpaceTaskListProps) => {
  const { t } = useTranslation()
  const isCreator = space?.connectionStatusToMyself?.includes(SpaceConnectionType.CREATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const isCollaborator = isAdmin || isCreator || isMember

  const itemsInRow = useBreakpointMatcher([
    [0, 1],
    [+vars.breakpointM, 2],
    [+vars.breakpointL, 3],
    [+vars.breakpointXxl, 4],
  ])

  const navigateToAddTasksScreen = () => {
    //TODO: add navigation
  }

  const CollaborationArea = () => {
    return (
      <View style={styles.collaborationAreaContainer}>
        <LinkHubWidget space={space} />
        <View style={{ marginTop: 16 }}>
          <StorageWidget space={space} />
        </View>
      </View>
    )
  }

  const NewToolsTeaser = () => {
    return (
      <View>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_new_tools.svg')}
          width={96}
          height={96}
          label={''}
          isSvg={true}
          resizeMode="contain"
          style={styles.illustration}
        />
        <HoliText size={'small'} style={styles.emptyMessage}>
          {t('spaces.spaceDetails.newTools.message')}
        </HoliText>
      </View>
    )
  }

  const NoTasks = () => {
    const cardProps = {
      headerRightIcon: isAdmin ? 'add' : undefined,
      onPressHeaderRight: isAdmin ? () => navigateToAddTasksScreen() : undefined,
    }

    return (
      <>
        {(isCollaborator && (
          <CollaboratorAreaCard
            headerLeftIcon="checkbox"
            title={t('spaces.spaceDetails.tasks.header.title')}
            {...cardProps}
          >
            <View style={[style, styles.empty]}>
              <HoliText size={'small'} style={styles.emptyMessage}>
                {t('spaces.spaceDetails.tasks.empty.message.forCreators')}
              </HoliText>
              {isAdmin && (
                <HoliText size={'small'} style={styles.instruction}>
                  {t('spaces.spaceDetails.tasks.empty.instruction')}
                </HoliText>
              )}
            </View>
          </CollaboratorAreaCard>
        )) || (
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
        )}
      </>
    )
  }

  type TasksListProps = {
    tasks: Task[]
  }

  const TasksList = ({ tasks }: TasksListProps) => {
    return (
      <HoliGridWrapper itemsInRow={itemsInRow}>
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          tasks.map((task) => (
            <HoliGridCell key={task.id}>
              <SpaceTaskTile task={task} style={styles.taskTile} />
            </HoliGridCell>
          ))
        }
      </HoliGridWrapper>
    )
  }

  type TasksCardProps = {
    tasks: Task[]
  }

  const TasksCard = ({ tasks }: TasksCardProps) => {
    const cardProps = {
      headerRightIcon: isAdmin ? 'add' : undefined,
      onPressHeaderRight: isAdmin ? () => navigateToAddTasksScreen() : undefined,
    }

    return (
      <>
        {(isCollaborator && (
          <CollaboratorAreaCard
            headerLeftIcon="checkbox"
            title={t('spaces.spaceDetails.tasks.header.title')}
            {...cardProps}
          >
            <View style={styles.tasksListContainer}>
              <TasksList tasks={tasks} />
            </View>
          </CollaboratorAreaCard>
        )) || <TasksList tasks={tasks} />}
      </>
    )
  }

  return (
    <>
      <View style={style}>
        {isCollaborator && <CollaborationArea />}
        {(space && space.tasks && space.tasks.length > 0 && <TasksCard tasks={space.tasks} />) || <NoTasks />}
        {isCollaborator && <NewToolsTeaser />}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
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
  tasksListContainer: { padding: 8 },
  taskTile: {
    flex: 1,
  },
  collaborationAreaContainer: {
    marginBottom: 16,
  },
  illustration: {
    marginTop: 32,
  },
})

export default SpaceTaskList
