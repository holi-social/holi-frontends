import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import PlacesAutocomplete, {
  GeolocationLevel,
  GeolocationSuggestion,
  PlacesAutocompleteProps,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
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
      <HoliHeading level="1" size="l" testID="account-setup-location-step-headline">
        {t('registration.accountSetup.location.heading')}
      </HoliHeading>

      <HoliGap size="s" />
      <HoliText>{t('registration.accountSetup.location.describtion')}</HoliText>

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
