import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

export interface SpaceFilter {
  location?: GeolocationSuggestion
  topicSlugs: string[]
  skillSlugs: string[]
}

export const isSpaceFilterEmpty = (filter: SpaceFilter) =>
  !filter.topicSlugs.length && !filter.skillSlugs.length && !filter.location
