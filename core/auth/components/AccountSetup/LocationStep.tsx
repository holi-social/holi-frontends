import { Text } from 'holi-bricks/components/text/Text'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import PlacesAutocomplete, {
  GeolocationLevel,
  GeolocationSuggestion,
  PlacesAutocompleteProps,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { ScrollToProps, useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { useTheme } from '@holi/ui/styles/theme'

export interface LocationStepProps
  extends Pick<PlacesAutocompleteProps, 'selected' | 'onChange' | 'validationErrorText' | 'testID'> {
  scrollToInputWithId: (id: string) => ScrollToProps
}

export const useLocationStep = (user?: User | null) => {
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(
    user?.location && user?.geolocationId ? { label: user.location, id: user?.geolocationId } : undefined
  )

  const locationScrollViewRef = useRef<ScrollView>(null)
  const scrollToLocationInputWithId = useScrollToInputOnFocus(locationScrollViewRef)

  return {
    selectedLocation,
    setSelectedLocation,
    scrollToLocationInputWithId,
    locationScrollViewRef,
  }
}

const LocationStep = ({ testID, scrollToInputWithId, ...placesAutocompleteProps }: LocationStepProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View testID={testID}>
      <Text size="3xl" headingLevel="1">
        {t('registration.accountSetup.location.heading')}
      </Text>

      <HoliGap size="s" />
      <Text size={'md'}>{t('registration.accountSetup.location.describtion')}</Text>

      <HoliGap size="m" />
      <PlacesAutocomplete
        label={t('user.profileForm.location')}
        placeholder={t('user.profileForm.locationPlaceholder')}
        id="user-location-input"
        testID="user-location"
        suggestionsStyle={{ backgroundColor: colors.background10 }}
        helperText={t('profile.location.validation.helper')}
        enhanceWithDetails
        level={GeolocationLevel.CITY}
        {...placesAutocompleteProps}
        {...scrollToInputWithId('location')}
      />
    </View>
  )
}

export default LocationStep
