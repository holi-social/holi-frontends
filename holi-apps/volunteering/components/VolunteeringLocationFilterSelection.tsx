import React from 'react'
import PlacesAutocomplete, {
  GeolocationLevel,
  type GeolocationSuggestion,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { suggestedLocations } from '@holi-apps/volunteering/helpers/suggestedLocations'
import { TextLink } from 'holi-bricks/components/text'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'

interface VolunteeringLocationFilterProps {
  selected: GeolocationSuggestion | undefined
  onSelect: (location: GeolocationSuggestion | undefined) => void
}

export const VolunteeringLocationFilterSelection = ({ selected, onSelect }: VolunteeringLocationFilterProps) => {
  const { t } = useTranslation()
  const language = useUserLanguage()

  return (
    <Stack gap="xxs">
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
      <Stack direction="row" wrap="wrap" gap="3xs" padding={{ left: 'xxs', right: 'xxs' }}>
        {suggestedLocations.map(({ overrideEn, ...suggestionDe }) => {
          const suggestion = language === 'en' ? { ...suggestionDe, ...overrideEn } : suggestionDe
          return (
            <TextLink size="md" color="informative" key={suggestion.id} onPress={() => onSelect(suggestion)}>
              {suggestion.city}
            </TextLink>
          )
        })}
      </Stack>
    </Stack>
  )
}
