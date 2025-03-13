import { useCallback, useMemo, useState } from 'react'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import type { SearchFilter } from '@holi/core/screens/search/typesense/types'

export const useSearchFilter = (
  initialFilter: Partial<SearchFilter>,
  onFilterChange: (filter: Partial<SearchFilter>) => void
) => {
  const [filter, setFilter] = useState<SearchFilter>({
    query: '',
    facet: 'volunteering',
    ...initialFilter,
  })

  const updateFilter = useCallback(
    (filter: SearchFilter) => {
      setFilter(filter)
      onFilterChange(filter)
    },
    [onFilterChange]
  )

  const setQuery = useCallback((query: string) => updateFilter({ ...filter, query }), [filter, updateFilter])

  const setFacet = useCallback((facet: string) => updateFilter({ ...filter, facet }), [filter, updateFilter])

  const setLocation = useCallback(
    (location?: GeolocationSuggestion) =>
      updateFilter({
        ...filter,
        location,
      }),
    [filter, updateFilter]
  )

  const isFilterEmpty = useMemo(() => !filter.query && !filter.location, [filter])

  return {
    filter,
    isFilterEmpty,
    setQuery,
    setFacet,
    setLocation,
  }
}
