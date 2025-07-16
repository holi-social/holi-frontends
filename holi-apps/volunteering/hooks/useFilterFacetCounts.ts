import { buildVolunteeringFilterParameters } from '@holi-apps/volunteering/helpers/buildVolunteeringFilterParameters'
import { filterKeyToFacetMapping, MAX_FACET_COUNT } from '@holi-apps/volunteering/helpers/filterFacetData'
import type { VolunteeringFilterKey, VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useTypesensePaginationMultiQuery } from '@holi/core/typesense/hooks/useTypesensePaginationMultiQuery'
import { useMemo } from 'react'

interface UseFilterFacetCountsProps {
  filters: VolunteeringFilters
  loadingFilters?: boolean
}

/**
 * In order to get correct facet counts for a filter facet we have to exclude
 * filtering for the same facet as multiple options are applied disjunctively.
 * All other filters are applied "as usual".
 *
 * @param filters The current filter selection.
 * @param facet The facet for which the parameters should be built. Excludes filtering for this particular facet.
 * @returns The parameters to get the correct counts for the selected facet.
 */
const buildParametersForFacet = (filters: VolunteeringFilters, facet: VolunteeringFilterKey) => {
  const { filter_by } = buildVolunteeringFilterParameters(filters, { excludeFilter: facet })
  return {
    filter_by,
    per_page: 0,
    facet_by: filterKeyToFacetMapping[facet],
    max_facet_values: MAX_FACET_COUNT,
  }
}

const facets: VolunteeringFilterKey[] = ['topics', 'skills', 'commitmentLabels', 'commitmentDurations']

export const useFilterFacetCounts = ({ filters, loadingFilters = false }: UseFilterFacetCountsProps) => {
  const { displayError } = useErrorHandling()

  const parameterList = useMemo(() => {
    return facets.map((facet) => buildParametersForFacet(filters, facet))
  }, [filters])

  const { states, isLoading, refetch } = useTypesensePaginationMultiQuery({
    parameterList,
    skip: loadingFilters,
    onError: (error) => {
      displayError(error, 'Error retrieving filter facet counts', {
        location: 'useFilterFacetCounts.useTypesensePaginationQuery',
      })
    },
  })

  useOnRefresh(refetch)

  const facetCounts = useMemo(() => {
    return states.reduce((mapping, response) => {
      return {
        ...mapping,
        ...response.facetCounts,
      }
    }, {})
  }, [states])

  return {
    isLoading: isLoading || loadingFilters,
    facetCounts,
  }
}
