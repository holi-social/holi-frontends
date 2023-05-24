import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers'
import useDeleteSpace from '@holi/core/hooks/spaces/useDeleteSpace'
import useUpdateSpaceUserConnection from '@holi/core/hooks/spaces/useUpdateSpaceUserConnection'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { Space } from '@holi/core/screens/spaces/types'

interface UseLeaveSpace {
  confirmationTitle: string
  confirmationDescription: string
  isLoadingLeaveSpace: boolean
  leaveSpaceAction: () => void
}

export const useLeaveSpace = (space?: Space): UseLeaveSpace => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const id = space?.id ?? ''

  const [isLoadingDelete, deleteSpace] = useDeleteSpace(id)
  const [isLoadingLeave, leaveSpace] = useUpdateSpaceUserConnection(
    id,
    SpaceConnectionType.MEMBER,
    SpaceConnectionAction.LEAVE_SPACE
  )

  const deleteAction = useCallback(() => {
    navigate('/spaces')
    deleteSpace().catch((e) => logError(e))
  }, [navigate, deleteSpace])

  const leaveAction = useCallback(() => {
    navigate('/spaces')
    leaveSpace().catch((e) => logError(e))
  }, [navigate, leaveSpace])

  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)
  const totalMembers = space?.members.totalResults ?? 0

  if (isMember && totalMembers === 1) {
    const confirmationTitle = t('spaces.spaceDetails.leave.soleMember.confirmation.title')
    const confirmationDescription = t('spaces.spaceDetails.leave.soleMember.confirmation.description')
    const isLoadingLeaveSpace = isLoadingDelete
    return { confirmationTitle, confirmationDescription, isLoadingLeaveSpace, leaveSpaceAction: deleteAction }
  } else if (isMember && !isAdmin && totalMembers > 1) {
    const confirmationTitle = t('spaces.spaceDetails.leave.notSoleMember.confirmation.title')
    const confirmationDescription = t('spaces.spaceDetails.leave.notSoleMember.confirmation.description', {
      space: space?.title ?? '',
    })
    const isLoadingLeaveSpace = isLoadingLeave
    return { confirmationTitle, confirmationDescription, isLoadingLeaveSpace, leaveSpaceAction: leaveAction }
  }

  return {
    confirmationTitle: '',
    confirmationDescription: '',
    isLoadingLeaveSpace: false,
    leaveSpaceAction: leaveAction,
  }
}
