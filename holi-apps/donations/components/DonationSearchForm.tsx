import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeSyntheticEvent, StyleSheet, TextInputKeyPressEventData, TextInputProps, View } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

type DonationSearchFormProps = {
  locationQuery?: string
  onSubmit?: (locationQuery?: string) => void
}

const DonationSearchForm: React.VFC<DonationSearchFormProps> = ({
  onSubmit,
  locationQuery,
}: DonationSearchFormProps) => {
  const { t } = useTranslation()
  const [locationInput, setLocationInput] = useState(locationQuery || '')
  const submit = () => {
    onSubmit && onSubmit(locationInput)
  }
  const onKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData | TextInputProps>) => {
    const nativeElement = event.nativeEvent as TextInputKeyPressEventData
    if (nativeElement.key === 'Enter') {
      submit()
    }
  }

  return (
    <HoliModalContentWrapper
      actionButtonText={t('donations:search.submitButton')}
      onActionButtonPress={submit}
      style={styles.modalWrapper}
    >
      <View style={styles.container}>
        <HoliHeading style={styles.heading}>{t('donations:search.heading')}</HoliHeading>
        <HoliTextInput
          inputLabel={t('donations:search.location.label')}
          accessibilityLabel={t('donations:search.location.label')}
          placeholder={t('donations:search.location.placeholder')}
          value={locationInput}
          trailingIcon="search"
          onChange={setLocationInput}
          inputProps={{ autoFocus: true, onKeyPress }}
        />
      </View>
    </HoliModalContentWrapper>
  )
}

export default DonationSearchForm

const styles = StyleSheet.create({
  modalWrapper: {
    height: '100%',
  },
  container: {
    marginHorizontal: 16,
    height: '100%',
  },
  heading: {
    marginBottom: 24,
  },
})
