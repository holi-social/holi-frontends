import type React from 'react'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useDeleteTask from '@holi/core/hooks/spaces/useDeleteTask'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType, ContentType3K } from '@holi/core/queries'
import { Delete, Edit2, Flag, More } from '@holi/icons/src/generated'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { mono } from 'holi-bricks/foundations'
import { SpaceByIdDocument } from '@holi/api/graphql/graphql-codegen'

export type TaskDrawerProps = {
  taskId?: string
  spaceName?: string
  isOwner?: boolean
  tintColor?: string
}

export const TaskDrawer: React.FunctionComponent<TaskDrawerProps> = ({ tintColor, taskId, spaceName, isOwner }) => {
  const { navigate } = useRouting()
  const route = usePathname()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const { t } = useTranslation()
  const loginState = useLoggedInUser()
  const { displayError } = useErrorHandling()
  const [deleteTask] = useDeleteTask()

  if (!loginState.isLoggedIn) {
    return null
  }

  return (
    <HoliActionDrawer.Drawer
      renderCustomButton={(onPress, testID) => {
        return (
          <HoliButton label={t('global.moreOptions')} transparent inline onPress={onPress} testID={testID}>
            <HoliIcon icon={More} colorOverride={tintColor || mono['800']} />
          </HoliButton>
        )
      }}
      label={t('global.moreOptions')}
      testID="btn-task-more-options"
      variant="default"
    >
      {isOwner ? (
        <>
          <HoliActionDrawer.Action
            icon={Edit2}
            title={t('global.edit')}
            testID="btn-to-edit-task"
            handleAction={() => navigate(`/spaces/${spaceName}/tasks/${taskId}/edit`)}
          />
          <HoliActionDrawer.Action
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
              handleConfirmation={async () => {
                if (taskId) {
                  deleteTask({
                    variables: {
                      id: taskId,
                    },
                    refetchQueries: [{ query: SpaceByIdDocument, variables: { idOrName: spaceName } }],
                    onError: (error) => {
                      displayError(error, 'Failed to delete task', {
                        displayMessage: t('spaces.tasks.delete.error'),
                        location: 'useDeleteTask',
                        taskId: taskId,
                        spaceIdOrName: spaceName,
                      })
                    },
                  })
                  const spaceUri = `/spaces/${spaceName}`
                  if (route.split('?')?.[0] !== spaceUri) navigate(spaceUri)
                }
              }}
              buttonVariant="danger"
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
            navigateWithAuth(`/report/${taskId}/${ContentType.SPACE_TASK}/${ContentType3K.SPACE_TASK}`)
          }
        />
      )}
    </HoliActionDrawer.Drawer>
  )
}
