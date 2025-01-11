import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

const contentValues = ['CHALLENGES', 'POSTS', 'VOLUNTEERING', 'SPACES'] as const // eslint-disable-line @typescript-eslint/no-unused-vars
export type ContentValue = (typeof contentValues)[number]

export interface OnboardingUserData {
  content: ContentValue | undefined
  location: GeolocationSuggestion | undefined
  interests: string[]
  skills: string[]
}
