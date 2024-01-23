import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import { ScrollToProps, useScrollToInputOnFocus } from '@holi//ui/helper/useScrollToInputOnFocus'
import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, {
  GeolocationLevel,
  GeolocationSuggestion,
  PlacesAutocompleteProps,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export interface LocationStepProps
  extends Pick<
    PlacesAutocompleteProps,
    'selected' | 'onChangeText' | 'onClose' | 'value' | 'validationErrorText' | 'testID'
  > {
  scrollToInputWithId: (id: string) => ScrollToProps
}

export const useLocationStep = (user?: User | null) => {
  const { t } = useTranslation()
  const [locationQuery, setLocationQuery] = useState(user?.location ?? '')
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(
    user?.location && user?.geolocationId ? { label: user.location, id: user?.geolocationId } : undefined
  )

  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  const resetErrorsForField = useCallback(
    (fieldName: string) =>
      setFieldErrors((currentErrors: TranslatedFieldErrors) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fieldName]: _, ...otherErrors } = currentErrors
        return otherErrors
      }),
    []
  )

  const onLocationClose = useCallback(
    (selectedSuggestion?: GeolocationSuggestion) => {
      setSelectedLocation(selectedSuggestion)

      if (!selectedSuggestion && locationQuery.length) {
        setFieldErrors({ location: [t('profile.location.validation.error')] })
      } else {
        resetErrorsForField('location')
      }
    },
    [locationQuery, t, resetErrorsForField]
  )

  const locationScrollViewRef = useRef<ScrollView>(null)
  const scrollToLocationInputWithId = useScrollToInputOnFocus(locationScrollViewRef)

  return {
    locationQuery,
    onLocationQueryChange: setLocationQuery,
    selectedLocation,
    onLocationClose,
    scrollToLocationInputWithId,
    locationScrollViewRef,
    locationValidationErrorText: fieldErrors?.location?.join(),
  }
}

const LocationStep = ({ testID, scrollToInputWithId, ...placesAutocompleteProps }: LocationStepProps) => {
  const { t } = useTranslation()

  return (
    <View testID={testID}>
      <HoliHeading level="1" size="large" testID="account-setup-location-step-headline">
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
        helperText={placesAutocompleteProps.selected ? undefined : t('profile.location.validation.helper')}
        fetchDetailsOnClose
        level={GeolocationLevel.CITY}
        {...placesAutocompleteProps}
        {...scrollToInputWithId('location')}
      />
    </View>
  )
}

export default LocationStep
