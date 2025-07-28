import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

export interface OnboardingUserData {
  location: GeolocationSuggestion | undefined
  interests: string[]
  skills: string[]
}
