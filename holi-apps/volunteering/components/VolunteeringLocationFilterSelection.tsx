import React from 'react'
import PlacesAutocomplete, {
  GeolocationLevel,
  type GeolocationSuggestion,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useTranslation } from 'react-i18next'

interface VolunteeringLocationFilterProps {
  selected: GeolocationSuggestion | undefined
  onSelect: (location: GeolocationSuggestion | undefined) => void
}

export const VolunteeringLocationFilterSelection = ({ selected, onSelect }: VolunteeringLocationFilterProps) => {
  const { t } = useTranslation()

  return (
    <PlacesAutocomplete
      label=""
      placeholder={t('volunteering.filter.location.placeholder')}
      id="volunteering-filter-location"
      testID="volunteering-filter-location"
      level={GeolocationLevel.CITY}
      selected={selected}
      onChange={onSelect}
      inputProps={{
        inputMode: 'search',
        returnKeyType: 'search',
        'aria-label': t('volunteering.filter.location.label'),
      }}
    />
  )
}
