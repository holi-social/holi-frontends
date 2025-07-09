import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

export const emptyFilters: VolunteeringFilters = {
  location: undefined,
  topics: undefined,
  skills: undefined,
  commitmentLabels: undefined,
  commitmentDurations: undefined,
}

export const testLocation: GeolocationSuggestion = {
  id: '42',
  label: 'Hamburg, Germany',
}

export const fullFilters: VolunteeringFilters = {
  location: testLocation,
  topics: ['migration-refugees', 'mobility-transport'],
  skills: ['food-service', 'finances-taxes', 'fundraising'],
  commitmentDurations: ['DAYS_1'],
  commitmentLabels: ['recurring'],
}
