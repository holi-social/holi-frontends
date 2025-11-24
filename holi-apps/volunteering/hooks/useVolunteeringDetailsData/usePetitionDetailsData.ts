import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { TypesenseDocumentType } from '@holi/core/typesense/types'
import { useLoginState } from '@holi/core/auth/loginState'
import { usePetitionStatusQuery } from '@holi/api/graphql/graphql-codegen'

export const usePetitionDetailsData = (petitionId: string) => {
  const loginState = useLoginState()
  const { replaceRoute } = useRouting()
  const { displayError } = useErrorHandling()

  const normalizedTypesenseId = petitionId.startsWith('petition_') ? petitionId.slice('petition_'.length) : petitionId

  const { isLoading, document, refresh } = useSingleTypesenseDocumentQuery(
    normalizedTypesenseId,
    TypesenseDocumentType.Petition,
    {
      onError: (error) => {
        displayError(error, 'Failed to load petition opportunity', {
          location: 'usePetitionDetailsData',
          petitionId,
        })
      },
      onNotFound: () => {
        return replaceRoute('/404')
      },
    }
  )

  const {
    data: { petitionStatus } = {},
    loading: isLoadingStatus,
    refetch: refetchStatus,
  } = usePetitionStatusQuery({
    fetchPolicy: 'no-cache',
    variables: {
      petitionId: petitionId,
    },
    skip: !loginState.isLoggedIn,
  })

  useOnRefresh(refresh)

  return {
    isLoading: isLoading || isLoadingStatus,
    document: document,
    status: petitionStatus?.status,
    refetchStatus,
    refetchDocument: refresh,
  }
}
