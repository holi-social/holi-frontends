import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'

type DonationSearchFormProps = {
  locationQuery?: string
  onSubmit: (locationQuery?: string) => void
}

const DonationSearchForm = ({ onSubmit, locationQuery }: DonationSearchFormProps) => {
  const { t } = useTranslation()
  const [locationInput, setLocationInput] = useState(locationQuery)

  const reset = useCallback(() => {
    setLocationInput('')
  }, [setLocationInput])

  return (
    <HoliModalContentWrapper
      actionButtonText={t('donations:search.submitButton')}
      onActionButtonPress={() => onSubmit(locationInput)}
      style={styles.modalWrapper}
      testID="donations-search-modal-content"
      keyboardShouldPersistTaps="always"
      hideFooterWhenKeyboardIsOpen={true}
    >
      <View style={styles.container}>
        <View style={styles.headingRow}>
          <HoliHeading>{t('donations:search.heading')}</HoliHeading>
          <HoliButton
            inline
            label={t('global.reset')}
            onPress={reset}
            type="secondary"
            variant="small"
            testID="donations-search-form-reset"
          >
            <HoliText>{t('global.reset')}</HoliText>
            <HoliIcon icon={Close} size={20} style={styles.clearFilter} />
          </HoliButton>
        </View>
        <PlacesAutocomplete
          value={locationInput}
          label={t('donations:search.location.label')}
          placeholder={t('donations:search.location.placeholder')}
          inputProps={{ autoFocus: true }}
          testID="donations-search-location"
          id="donations-search-location"
          onChangeText={(value) => setLocationInput(value)}
          onSubmit={(selected?: GeolocationSuggestion) => onSubmit(selected?.label)}
          onChange={(selected: GeolocationSuggestion) => setLocationInput(selected.label)}
        />
      </View>
    </HoliModalContentWrapper>
  )
}

export default DonationSearchForm

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
  },
  container: {
    marginHorizontal: 16,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 2,
  },
  clearFilter: {
    paddingLeft: 3,
  },
})
