import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { ScrollToProps } from '@holi//ui/helper/useScrollToInputOnFocus'
import PlacesAutocomplete, { PlacesAutocompleteProps } from '@holi/core/location/components/PlacesAutocomplete'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
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

const LocationStep = ({ testID, scrollToInputWithId, ...placesAutocompleteProps }: LocationStepProps) => {
  const { t } = useTranslation()

  return (
    <View testID={testID}>
      <HoliHeading level="1" size="large" testID="headline">
        {t('registration.accountSetup.location.heading')}
      </HoliHeading>

      <HoliBox padding={[16, 0, 0, 0]}>
        <HoliText>{t('registration.accountSetup.location.describtion')}</HoliText>
      </HoliBox>

      <HoliBox padding={[24, 0, 0, 0]}>
        <PlacesAutocomplete
          label={t('user.profileForm.location')}
          placeholder={t('user.profileForm.locationPlaceholder')}
          id="user-location-input"
          testID="user-location"
          suggestionsStyle={{ backgroundColor: colors.background10 }}
          helperText={location ? undefined : t('profile.location.validation.helper')}
          withCoordinates
          {...placesAutocompleteProps}
          {...scrollToInputWithId('location')}
        />
      </HoliBox>
    </View>
  )
}

export default LocationStep
