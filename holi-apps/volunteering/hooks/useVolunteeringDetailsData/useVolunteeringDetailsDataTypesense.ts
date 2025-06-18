import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useTranslation } from 'react-i18next'
import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { transformTypesenseDocument } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformTypesenseDocument'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { TypesenseDocumentType } from '@holi/core/typesense/types'

export const useVolunteeringDetailsDataTypesense = (volunteeringId: string) => {
  const { replaceRoute } = useRouting()
  const { t } = useTranslation()
  const userLanguage = useUserLanguage()
  const { displayError } = useErrorHandling()

  const { isLoading, document, refresh } = useSingleTypesenseDocumentQuery(
    volunteeringId,
    TypesenseDocumentType.Volunteering,
    {
      onError: (error) => {
        displayError(error, 'Failed to load volunteering opportunity', {
          location: 'useVolunteeringDetailsDataTypesense',
          volunteeringId,
        })
      },
      onNotFound: () => {
        return replaceRoute('/404')
      },
    }
  )

  useOnRefresh(refresh)

  return {
    isLoading,
    document: document ? transformTypesenseDocument(t, userLanguage, document) : undefined,
  }
}
