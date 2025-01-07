import type React from 'react'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useDeleteTask from '@holi/core/hooks/spaces/useDeleteTask'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType, ContentType3K } from '@holi/core/queries'
import { type Space, SpaceConnectionType, type Task } from '@holi/core/screens/spaces/types'
import { Delete, Edit2, Flag } from '@holi/icons/src/generated'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'

export type TaskDrawerProps = {
  space: Space
  task: Task
}

export const TaskDrawer: React.FunctionComponent<TaskDrawerProps> = ({ task, space }) => {
  const { navigate } = useRouting()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const { t } = useTranslation()
  const loginState = useLoggedInUser()

  const [isLoadingDeleteTask, deleteTask] = useDeleteTask({
    id: task.id,
    spaceIdOrName: space.name,
    successMsg: t('spaces.tasks.delete.success'),
  })

  const isMember = !!space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = !!space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const isCollaborator = isAdmin || isMember
  const isTaskOwner = loginState.isLoggedIn && isCollaborator && loginState.user.id === task.creator.id

  if (!loginState.isLoggedIn) {
    return <></>
  }

  return (
    <HoliActionDrawer.Drawer label={t('global.moreOptions')} testID="btn-task-more-options" variant="dark">
      {isTaskOwner || isAdmin ? (
        <>
          <HoliActionDrawer.Action
            icon={Edit2}
            title={t('global.edit')}
            testID="btn-to-edit-task"
            handleAction={() => navigate(`/spaces/${space.name}/tasks/${task.id}/edit`)}
          />
          <HoliActionDrawer.Action
            isLoading={isLoadingDeleteTask}
            icon={Delete}
            title={t('spaces.digitalTool.delete.label')}
            variant="danger"
            testID="btn-to-delete-task"
            showConfirmation
          >
            <HoliActionDrawer.Confirmation
              title={t('spaces.tasks.delete.confirmation.title')}
              description={t('spaces.tasks.delete.confirmation.description')}
              testID="task-delete"
              handleConfirmation={deleteTask}
              buttonType="warning"
              hasDismissBtn
              requireLogin
            />
          </HoliActionDrawer.Action>
        </>
      ) : (
        <HoliActionDrawer.Action
          icon={Flag}
          title={t('global.report')}
          testID="btn-report-post"
          handleAction={() =>
            navigateWithAuth(`/report/${task.id}/${ContentType.SPACE_TASK}/${ContentType3K.SPACE_TASK}`)
          }
        />
      )}
    </HoliActionDrawer.Drawer>
  )
}
