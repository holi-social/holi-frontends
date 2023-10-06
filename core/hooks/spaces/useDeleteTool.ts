import { useMutation } from '@apollo/client'
import type { FetchResult, MutationFunctionOptions } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  DeleteCollaborationToolResponse,
  deleteCollaborationToolMutation,
} from '@holi/core/screens/spaces/linkHub/mutations'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseDeleteTool = [boolean, (options?: MutationFunctionOptions) => Promise<FetchResult>]

interface UseDeleteToolProps {
  id: string
  spaceIdOrName: string
  successMsg: string
  handleDelete?: () => void
}

const useDeleteTool = ({ id, spaceIdOrName, successMsg, handleDelete }: UseDeleteToolProps): UseDeleteTool => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [deleteTool, { loading }] = useMutation<DeleteCollaborationToolResponse>(deleteCollaborationToolMutation, {
    variables: { id },
    onCompleted: () => {
      openToast(successMsg, HoliToastType.SUCCESS)
      handleDelete?.()
    },
    onError: (error) =>
      displayError(error, 'Failed to delete tool', {
        displayMessage: t('spaces.digitalTool.delete.error'),
        location: 'useDeleteTool',
        toolId: id,
        spaceIdOrName,
      }),
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
  })

  return [loading, deleteTool]
}

export default useDeleteTool
