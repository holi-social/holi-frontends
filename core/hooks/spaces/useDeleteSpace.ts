import { useTranslation } from 'react-i18next'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { MySpacesDocument, useDeleteSpaceMutation } from '@holi/api/graphql/graphql-codegen'

const useDeleteSpace = (spaceId: string) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [deleteSpace, { loading: isLoading }] = useDeleteSpaceMutation({
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
    refetchQueries: [{ query: MySpacesDocument }],
  })

  return [isLoading, deleteSpace] as const
}

export default useDeleteSpace
