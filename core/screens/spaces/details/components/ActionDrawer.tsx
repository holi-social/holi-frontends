import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useDeleteSpace from '@holi/core/hooks/spaces/useDeleteSpace'
import { useLeaveSpace } from '@holi/core/hooks/spaces/useLeaveSpace'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType, ContentType3K } from '@holi/core/queries'
import { determineSpaceViewerRelation } from '@holi/core/screens/spaces/details/utils'
import { Space } from '@holi/core/screens/spaces/types'
import { Delete, DoorClosed, Edit2, Flag, UserSettings } from '@holi/icons/src/generated'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export const ActionDrawer: React.FC<{ space: Space }> = ({ space }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const loginState = useLoggedInUser()

  const [isLoading, deleteSpace] = useDeleteSpace(space.id)
  const {
    confirmationTitle,
    confirmationDescription,
    isLoadingLeaveSpace,
    dismissLeaveSpaceButton,
    confirmLeaveSpaceText,
    leaveSpaceAction,
  } = useLeaveSpace(space)

  const spaceId = space.id

  const { isMember, isAdmin } = determineSpaceViewerRelation(loginState, space)

  const editAction = useCallback(() => {
    navigate(`/spaces/${spaceId}/edit`)
  }, [navigate, spaceId])
  const deleteConfirmationAction = useCallback(() => {
    navigate('/spaces')
    deleteSpace()
  }, [deleteSpace, navigate])
  const manageCollaboratorsAction = useCallback(() => {
    navigate(`/spaces/${spaceId}/collaborators`)
  }, [navigate, spaceId])

  return (
    <>
      <HoliActionDrawer.Drawer label={t('global.moreOptions')} testID="space-options-btn" variant="dark">
        {isAdmin && (
          <>
            <HoliActionDrawer.Action
              isLoading={isLoading}
              icon={Edit2}
              title={t('global.edit')}
              handleAction={editAction}
              testID="space-edit"
            />
            <HoliActionDrawer.Action
              isLoading={isLoading}
              icon={UserSettings}
              title={t('spaces.collaborators.manage.modal.title')}
              handleAction={manageCollaboratorsAction}
            />
          </>
        )}
        {isMember && (
          <HoliActionDrawer.Action
            isLoading={isLoadingLeaveSpace}
            icon={DoorClosed}
            title={t('spaces.spaceDetails.leave')}
            showConfirmation
          >
            <HoliActionDrawer.Confirmation
              title={confirmationTitle}
              description={confirmationDescription}
              testID="space-leave"
              handleConfirmation={leaveSpaceAction}
              hasDismissBtn={dismissLeaveSpaceButton.show}
              dismissText={dismissLeaveSpaceButton.text}
              confirmText={confirmLeaveSpaceText}
              requireLogin
            />
          </HoliActionDrawer.Action>
        )}

        <HoliActionDrawer.Action
          icon={Flag}
          title={t('global.report')}
          handleAction={() => navigateWithAuth(`/report/${spaceId}/${ContentType.SPACE}/${ContentType3K.SPACE}`)}
        />

        {isAdmin && (
          <HoliActionDrawer.Action
            isLoading={isLoading}
            icon={Delete}
            title={t('global.delete')}
            variant="danger"
            showConfirmation
            testID="space-delete"
          >
            <HoliActionDrawer.Confirmation
              title={t('spaces.delete.confirmation.title')}
              description={t('spaces.delete.confirmation.description')}
              testID="space-delete"
              handleConfirmation={deleteConfirmationAction}
              hasDismissBtn
              requireLogin
            />
          </HoliActionDrawer.Action>
        )}
      </HoliActionDrawer.Drawer>
    </>
  )
}
