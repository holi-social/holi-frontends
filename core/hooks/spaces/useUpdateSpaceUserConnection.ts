import type { FetchResult, MutationFunctionOptions } from '@apollo/client'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseUpdateSpaceUserConnection = [boolean, (options?: MutationFunctionOptions) => Promise<FetchResult>]

const useUpdateSpaceUserConnection = (
  spaceId: string,
  spaceName: string,
  connectionType: SpaceConnectionType,
  connectAction: SpaceConnectionAction
): UseUpdateSpaceUserConnection => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [leaveSpace, { loading: isLoadingLeaveSpace }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
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
      refetchQueries: [{ query: mySpaceQuery }],
    }
  )

  return [isLoadingLeaveSpace, leaveSpace]
}

export default useUpdateSpaceUserConnection
