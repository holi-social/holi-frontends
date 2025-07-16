import { useMemo } from 'react'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import { buildVolunteeringFilterParameters } from '@holi-apps/volunteering/helpers/buildVolunteeringFilterParameters'

interface UseFilteredVolunteeringEngagementsProps {
  filters: VolunteeringFilters
  loadingFilters?: boolean
  pageSize: number
}

export const useFilteredVolunteeringEngagements = ({
  filters,
  loadingFilters = false,
  pageSize,
}: UseFilteredVolunteeringEngagementsProps) => {
  const { displayError } = useErrorHandling()
  const language = useUserLanguage()

  const parameters = useMemo(() => {
    return {
      ...buildVolunteeringFilterParameters(filters),
      per_page: pageSize,
    }
  }, [filters, pageSize])

  const { state, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    skip: loadingFilters,
    onError: (error) => {
      displayError(error, 'Error retrieving filtered volunteering engagements', {
        location: 'useFilteredVolunteeringEngagementsTypesense.useTypesensePaginationQuery',
      })
    },
  })

  const engagements = useMemo(
    () => state.hits.map((hit) => localizeTypesenseDocument(hit.document, language)),
    [language, state.hits]
  )

  useOnRefresh(refetch)

  return {
    isLoading: state.isLoading || loadingFilters,
    engagements,
    canFetchMore: state.canFetchMore,
    fetchNextPage,
    totalResults: state.totalResults,
  }
}
