import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import {
  MySpacesDocument,
  useUpdateSpaceUserConnectionMutation,
  type SpaceUserConnectionType,
  type UpdateConnectionAction,
} from '@holi/api/graphql/graphql-codegen'
import { useCallback } from 'react'

const useUpdateSpaceUserConnection = (
  spaceId: string,
  spaceName: string,
  connectionType: SpaceUserConnectionType,
  connectAction: UpdateConnectionAction
) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [leaveSpace, { loading: isLoadingLeaveSpace }] = useUpdateSpaceUserConnectionMutation({
    onCompleted: () => {
      openToast(t('spaces.leave.success', { space: spaceName }), HoliToastType.SUCCESS)
    },
    onError: (error) =>
      displayError(error, 'Failed to update space user connection', {
        displayMessage: t('spaces.leave.error'),
        location: 'useUpdateSpaceUserConnection',
        spaceId,
        connectionType,
        connectAction,
      }),
    refetchQueries: [{ query: MySpacesDocument }],
  })

  const leaveSpaceCallback = useCallback(
    () => leaveSpace({ variables: { spaceId, connectionType, connectAction } }),
    [leaveSpace, spaceId, connectionType, connectAction]
  )

  return [isLoadingLeaveSpace, leaveSpaceCallback] as const
}

export default useUpdateSpaceUserConnection
