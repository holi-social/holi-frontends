import { useSimilarVolunteeringSliderQuery } from '@holi/api/graphql/graphql-codegen'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useTranslation } from 'react-i18next'
import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { transformTypesenseDocument } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformTypesenseDocument'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'

export const useVolunteeringDetailsDataTypesense = (volunteeringId: string) => {
  const { replaceRoute } = useRouting()
  const { t } = useTranslation()
  const userLanguage = useUserLanguage()
  const { displayError } = useErrorHandling()

  const { isLoading, document, refresh } = useSingleTypesenseDocumentQuery(volunteeringId, 'volunteering', {
    onError: (error) => {
      displayError(error, 'Failed to load volunteering opportunity', {
        location: 'useVolunteeringDetailsDataTypesense',
        volunteeringId,
      })
    },
    onNotFound: () => {
      return replaceRoute('/404')
    },
  })

  const {
    data: similarVolunteering,
    loading: similarVolunteeringLoading,
    refetch: similarVolunteeringRefetch,
  } = useSimilarVolunteeringSliderQuery({
    variables: {
      id: volunteeringId,
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    skip: !volunteeringId,
  })

  useOnRefresh(() => {
    Promise.all([refresh(), similarVolunteeringRefetch({ id: volunteeringId })])
  })

  return {
    isLoading,
    document: document ? transformTypesenseDocument(t, userLanguage, document) : undefined,
    recommendations: similarVolunteering?.appVolunteering_similarRecommendations.data || [],
    recommendationsLoading: similarVolunteeringLoading,
  }
}
