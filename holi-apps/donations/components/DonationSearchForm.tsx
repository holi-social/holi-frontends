import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import PlacesAutocomplete, {
  GeolocationLevel,
  type GeolocationSuggestion,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { Close } from '@holi/icons/src/generated'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'

type DonationSearchFormProps = {
  selectedLocation?: GeolocationSuggestion | undefined
  onSelectLocation: (location: GeolocationSuggestion | undefined) => void
}

const DonationSearchForm = ({ onSelectLocation, selectedLocation }: DonationSearchFormProps) => {
  const { t } = useTranslation()

  const reset = useCallback(() => {
    onSelectLocation(undefined)
  }, [onSelectLocation])

  return (
    <HoliModalContentWrapper
      actionButtonText={t('donations.search.submitButton')}
      onActionButtonPress={() => onSelectLocation(selectedLocation)}
      style={styles.modalWrapper}
      testID="donations-search-modal-content"
      keyboardShouldPersistTaps="always"
      hideFooterWhenKeyboardIsOpen={true}
    >
      <View style={styles.container}>
        <View style={styles.headingRow}>
          <Text size="xxl" headingLevel="2">
            {t('donations.search.heading')}
          </Text>
          <Button
            inline
            label={t('global.reset')}
            onPress={reset}
            variant="secondary"
            size="sm"
            testID="donations-search-form-reset"
            icon={Close}
          />
        </View>
        <PlacesAutocomplete
          selected={selectedLocation}
          label={t('donations.search.location.label')}
          placeholder={t('donations.search.location.placeholder')}
          testID="donations-search-location"
          id="donations-search-location"
          onChange={onSelectLocation}
          level={GeolocationLevel.CITY}
          inputProps={{
            autoFocus: true,
            inputMode: 'search',
            returnKeyType: 'search',
            'aria-label': t('donations.search.location.label'),
          }}
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
