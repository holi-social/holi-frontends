import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import type { TypesensePaginationState } from '@holi/core/typesense/hooks/useTypesensePaginationMultiQuery'

export const SEARCH_FACETS_IN_ORDER = ['volunteering', 'space', 'profile'] as const
export type SearchFacet = (typeof SEARCH_FACETS_IN_ORDER)[number]

export interface SearchFilter {
  facet: SearchFacet
  query: string
  location?: GeolocationSuggestion
}

export type SearchResults = TypesensePaginationState
