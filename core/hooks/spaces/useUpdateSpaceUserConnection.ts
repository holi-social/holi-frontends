import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import {
  MySpacesDocument,
  useUpdateSpaceUserConnectionMutation,
  type SpaceUserConnectionType,
  type UpdateConnectionAction,
} from '@holi/api/graphql/graphql-codegen'

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
    variables: { spaceId, connectionType, connectAction },
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

  return [isLoadingLeaveSpace, leaveSpace] as const
}

export default useUpdateSpaceUserConnection
