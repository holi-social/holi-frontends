import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useTranslation } from 'react-i18next'
import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { transformTypesenseDocument } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformTypesenseDocument'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { TypesenseDocumentType } from '@holi/core/typesense/types'
import { useVolunteeringOpportunityStatusQuery } from '@holi/api/graphql/graphql-codegen'

export const useVolunteeringDetailsData = (volunteeringId: string, onOpenLink: (url?: string) => void) => {
  const { replaceRoute } = useRouting()
  const { t } = useTranslation()
  const language = useUserLanguage()
  const { displayError } = useErrorHandling()

  const { isLoading, document, refresh } = useSingleTypesenseDocumentQuery(
    volunteeringId,
    TypesenseDocumentType.Volunteering,
    {
      onError: (error) => {
        displayError(error, 'Failed to load volunteering opportunity', {
          location: 'useVolunteeringDetailsData',
          volunteeringId,
        })
      },
      onNotFound: () => {
        return replaceRoute('/404')
      },
    }
  )

  const {
    data: { volunteeringOpportunityStatus } = {},
    loading: isLoadingStatus,
    refetch: refetchStatus,
  } = useVolunteeringOpportunityStatusQuery({
    variables: {
      volunteeringOpportunityId: volunteeringId,
    },
  })

  useOnRefresh(refresh)

  return {
    isLoading: isLoading || isLoadingStatus,
    document: document
      ? transformTypesenseDocument({
          t,
          language,
          document,
          onOpenLink,
          status: volunteeringOpportunityStatus?.status ?? null,
        })
      : undefined,
    refetchStatus,
    refetchDocument: refresh,
  }
}
