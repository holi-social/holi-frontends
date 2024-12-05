import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

const contentValues = ['CHALLENGES', 'POSTS', 'VOLUNTEERING', 'SPACES'] as const
export type ContentValue = (typeof contentValues)[number]

export interface OnboardingUserData {
  content: ContentValue | null
  location: GeolocationSuggestion | undefined
  interests: string[]
  skills: string[]
}
