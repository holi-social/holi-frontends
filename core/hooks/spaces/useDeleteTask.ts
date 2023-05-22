import { useMutation } from '@apollo/client'
import type { FetchResult, MutationFunctionOptions } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { DeleteTaskResponse, deleteTaskMutation } from '@holi/core/screens/spaces/tasks/mutations'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseDeleteTask = [boolean, (options?: MutationFunctionOptions) => Promise<FetchResult>]

interface UseDeleteTaskProps {
  id: string
  spaceIdOrName: string
  successMsg: string
  handleDelete?: () => void
}

const useDeleteTask = ({ id, spaceIdOrName, successMsg, handleDelete }: UseDeleteTaskProps): UseDeleteTask => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [deleteTask, { loading: isLoadingDeleteTask }] = useMutation<DeleteTaskResponse>(deleteTaskMutation, {
    variables: { id },
    onCompleted: () => {
      openToast(successMsg, HoliToastType.SUCCESS)
      handleDelete?.()
    },
    onError: (error) => displayError(error, t('spaces.tasks.delete.error')),
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: spaceIdOrName } }],
  })

  return [isLoadingDeleteTask, deleteTask]
}

export default useDeleteTask
