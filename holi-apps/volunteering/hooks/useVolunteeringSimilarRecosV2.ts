import { useMemo } from 'react'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { logError } from '@holi/core/errors/helpers'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

interface UseVolunteeringSimilarRecosV2Props {
  documentId: string
  pageSize: number
}

export const useVolunteeringSimilarRecosV2 = ({
  documentId,
  pageSize,
}: UseVolunteeringSimilarRecosV2Props): LocalizedTypesenseDocument[] => {
  const language = useUserLanguage()

  const parameters = useMemo(
    () => ({
      filter_by: 'type:=[volunteering,task]',
      sort_by: '_vector_distance:asc',
      per_page: pageSize,
      vector_query: `similarity_embedding:([],id:${documentId})`,
    }),
    [documentId, pageSize]
  )

  const { state, refetch } = useTypesensePaginationQuery({
    parameters,
    onError: (error) => {
      logError(error, 'Error retrieving similar recommendations', {
        location: 'VolunteeringSimilarRecos.useTypesensePaginationQuery',
      })
    },
  })

  const recommendations = useMemo(
    () => state.hits.map((hit) => localizeTypesenseDocument(hit.document, language)),
    [language, state.hits]
  )

  useOnRefresh(refetch)

  return recommendations
}
