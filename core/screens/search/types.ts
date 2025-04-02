import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import type { TypesenseDocument, TypesenseDocumentType } from '@holi/core/typesense/types'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'

export const SEARCH_HIT_TYPES_IN_ORDER: TypesenseDocumentType[] = ['volunteering', 'space', 'profile'] as const

export interface SearchFilter {
  facet: TypesenseDocumentType
  query: string
  location?: GeolocationSuggestion
}

export interface SearchResults {
  isLoading: boolean
  hits: SearchResponseHit<TypesenseDocument>[]
  totalNrOfResults: number
  totalNrOfPages: number
  currentPage: number
  canLoadMore: boolean
  filter: SearchFilter
}
