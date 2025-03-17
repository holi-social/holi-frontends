import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'

export type SearchHitType = 'volunteering' | 'profile' | 'space'
export type SearchHitLinkLocatorIdOrSlug = string | number
export interface SearchHitData {
  type: SearchHitType
  id: string
  title_de?: string
  title_en?: string
  description_de?: string
  description_en?: string
  location?: string
  location_lat_lng?: [number, number]
  image_url?: string
  user_full_name?: string
  /**
   * Used to construct links to the entity on client-side. E.g. for a space task, this would look as follows:
   * {
   *   // ...
   *   link_locators: {
   *     space: "kiezputz",
   *     task: "1c83676f-5197-44c7-bea6-51a7e2f41959"
   *   }
   * }
   * This can then be used to reconstruct the URI path /$lang/spaces/kiezputz/tasks/1c83676f-5197-44c7-bea6-51a7e2f41959
   */
  link_locators?: Partial<Record<SearchHitType, SearchHitLinkLocatorIdOrSlug>>
}

export interface SearchFilter {
  facet: string
  query: string
  location?: GeolocationSuggestion
}

export interface SearchResults {
  isLoading: boolean
  hits: SearchResponseHit<SearchHitData>[]
  totalNrOfResults: number
  totalNrOfPages: number
  currentPage: number
  canLoadMore: boolean
  filter: SearchFilter
}
