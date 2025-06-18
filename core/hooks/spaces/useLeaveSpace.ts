import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import useDeleteSpace from '@holi/core/hooks/spaces/useDeleteSpace'
import useUpdateSpaceUserConnection from '@holi/core/hooks/spaces/useUpdateSpaceUserConnection'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { type Space, SpaceUserConnectionType, UpdateConnectionAction } from '@holi/api/graphql/graphql-codegen'

interface UseLeaveSpace {
  confirmationTitle: string
  confirmationDescription: string
  isLoadingLeaveSpace: boolean
  dismissLeaveSpaceButton: {
    show: boolean
    text: string
  }
  confirmLeaveSpaceText?: string
  leaveSpaceAction: () => void
}

export const useLeaveSpace = (
  space?: Pick<Space, 'connectionStatusToMyself' | 'id' | 'title' | 'members'>
): UseLeaveSpace => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { track } = useTracking()

  const id = space?.id ?? ''

  const [isLoadingDelete, deleteSpace] = useDeleteSpace(id)
  const [isLoadingLeave, leaveSpace] = useUpdateSpaceUserConnection(
    id,
    space?.title ?? '',
    SpaceUserConnectionType.Member,
    UpdateConnectionAction.LeaveSpace
  )

  const deleteAction = useCallback(() => {
    navigate('/spaces')
    deleteSpace()
  }, [navigate, deleteSpace])

  const leaveAction = useCallback(() => {
    navigate('/spaces')
    leaveSpace().then(() => track(TrackingEvent.Spaces.User.left(id)))
  }, [navigate, leaveSpace, track, id])

  const noAction = useCallback(() => {
    // Empty action when no actions are needed
  }, [])

  const isMember = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)
  const totalMembers = space?.members.totalResults ?? 0
  const totalAdmins = space?.members.data.filter((member) => member.isAdministrator === true).length ?? 0

  if (isMember && totalMembers === 1) {
    const confirmationTitle = t('spaces.spaceDetails.leave.soleMember.confirmation.title')
    const confirmationDescription = t('spaces.spaceDetails.leave.soleMember.confirmation.description')
    const isLoadingLeaveSpace = isLoadingDelete
    const dismissLeaveSpaceButton = {
      show: true,
      text: t('spaces.spaceDetails.leave.soleMember.confirmation.dismiss'),
    }
    const confirmLeaveSpaceText = t('spaces.spaceDetails.leave.soleMember.confirmation.confirm')
    return {
      confirmationTitle,
      confirmationDescription,
      isLoadingLeaveSpace,
      dismissLeaveSpaceButton,
      confirmLeaveSpaceText,
      leaveSpaceAction: deleteAction,
    }
  } else if ((isMember && !isAdmin && totalMembers > 1) || (isAdmin && totalAdmins > 1)) {
    const confirmationTitle = t('spaces.spaceDetails.leave.notSoleMember.confirmation.title')
    const confirmationDescription = t('spaces.spaceDetails.leave.notSoleMember.confirmation.description', {
      space: space?.title ?? '',
    })
    const isLoadingLeaveSpace = isLoadingLeave
    const dismissLeaveSpaceButton = {
      show: true,
      text: t('spaces.spaceDetails.leave.notSoleMember.confirmation.dismiss'),
    }
    const confirmLeaveSpaceText = t('spaces.spaceDetails.leave.notSoleMember.confirmation.confirm')
    return {
      confirmationTitle,
      confirmationDescription,
      isLoadingLeaveSpace,
      dismissLeaveSpaceButton,
      confirmLeaveSpaceText,
      leaveSpaceAction: leaveAction,
    }
  } else if (isAdmin && totalAdmins === 1) {
    const confirmationTitle = t('spaces.spaceDetails.leave.soleAdmin.confirmation.title')
    const confirmationDescription = t('spaces.spaceDetails.leave.soleAdmin.confirmation.description', {
      space: space?.title ?? '',
    })
    const isLoadingLeaveSpace = false
    const dismissLeaveSpaceButton = {
      show: false,
      text: '',
    }
    const confirmLeaveSpaceText = t('spaces.spaceDetails.leave.soleAdmin.confirmation.confirm')
    return {
      confirmationTitle,
      confirmationDescription,
      isLoadingLeaveSpace,
      dismissLeaveSpaceButton,
      confirmLeaveSpaceText,
      leaveSpaceAction: noAction,
    }
  }

  return {
    confirmationTitle: '',
    confirmationDescription: '',
    isLoadingLeaveSpace: false,
    dismissLeaveSpaceButton: {
      show: false,
      text: '',
    },
    leaveSpaceAction: noAction,
  }
}
