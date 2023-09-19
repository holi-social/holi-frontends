import type { FetchResult, MutationFunctionOptions } from '@apollo/client'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { DeleteSpaceResponse, deleteSpaceMutation } from '@holi/core/screens/spaces/details/mutations'
import { mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseDeleteSpace = [boolean, (options?: MutationFunctionOptions) => Promise<FetchResult>]

const useDeleteSpace = (spaceId: string): UseDeleteSpace => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [deleteSpace, { loading: isLoading }] = useMutation<DeleteSpaceResponse>(deleteSpaceMutation, {
    variables: { id: spaceId },
    onCompleted: () => {
      openToast(t('spaces.delete.success'), HoliToastType.SUCCESS)
    },
    onError: (error) =>
      displayError(error, 'Failed to delete space', {
        displayMessage: t('spaces.delete.error'),
        location: 'useDeleteSpace',
        spaceId,
      }),
    refetchQueries: [{ query: mySpaceQuery }],
  })

  return [isLoading, deleteSpace]
}

export default useDeleteSpace
