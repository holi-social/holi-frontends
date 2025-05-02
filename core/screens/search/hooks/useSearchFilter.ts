import { useCallback, useEffect, useState } from 'react'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { SEARCH_FACETS_IN_ORDER, type SearchFacet, type SearchFilter } from '@holi/core/screens/search/types'

export const useSearchFilter = (
  initialFilter: Omit<Partial<SearchFilter>, 'facet'> & { facet?: string },
  onFilterChange: (filter: Partial<SearchFilter>) => void
) => {
  const validFacet =
    (SEARCH_FACETS_IN_ORDER.includes(initialFilter.facet as SearchFacet)
      ? (initialFilter.facet as SearchFacet)
      : 'volunteering') ?? 'volunteering'
  const [filter, setFilter] = useState<SearchFilter>({
    ...initialFilter,
    query: initialFilter.query ?? '',
    facet: validFacet,
  })

  useEffect(() => {
    if (initialFilter.facet !== filter.facet) {
      onFilterChange({ facet: filter.facet })
    }
    // Only on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateFilter = useCallback(
    (filter: SearchFilter) => {
      setFilter(filter)
      onFilterChange(filter)
    },
    [onFilterChange]
  )

  const setQuery = useCallback((query: string) => updateFilter({ ...filter, query }), [filter, updateFilter])

  const setFacet = useCallback((facet: SearchFacet) => updateFilter({ ...filter, facet }), [filter, updateFilter])

  const setLocation = useCallback(
    (location?: GeolocationSuggestion) =>
      updateFilter({
        ...filter,
        location,
      }),
    [filter, updateFilter]
  )

  return {
    filter,
    setQuery,
    setFacet,
    setLocation,
  }
}
