import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import PlacesAutocomplete, {
  GeolocationLevel,
  type PlacesAutocompleteProps,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'

export type LocationSelectionProps = Pick<
  PlacesAutocompleteProps,
  'selected' | 'onChange' | 'validationErrorText' | 'testID'
>

const LocationSelection = ({ testID = 'location-selection', ...placesAutocompleteProps }: LocationSelectionProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View testID={testID}>
      <Text headingLevel="1" size="3xl">
        {t('onboarding.location.headline')}
      </Text>

      <HoliGap size="s" />
      <Text size="md">{t('onboarding.location.subline')}</Text>

      <HoliGap size="m" />
      <PlacesAutocomplete
        label={t('user.profileForm.location')}
        placeholder={t('onboarding.location.inputPlaceholder')}
        id="user-location-input"
        testID={`${testID}-autocomplete`}
        suggestionsStyle={{ backgroundColor: colors.background10 }}
        helperText={t('profile.location.validation.helper')}
        enhanceWithDetails
        level={GeolocationLevel.CITY}
        {...placesAutocompleteProps}
      />
    </View>
  )
}

export default LocationSelection
