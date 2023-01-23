import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import PlacesAutocomplete from '@holi/core/location/components/PlacesAutocomplete'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { colors } from '@holi/ui/styles/globalVars'

type DonationSearchFormProps = {
  locationQuery?: string
  onSubmit: (locationQuery?: string) => void
}

const DonationSearchForm: React.VFC<DonationSearchFormProps> = ({
  onSubmit,
  locationQuery,
}: DonationSearchFormProps) => {
  const { t } = useTranslation()
  const [locationInput, setLocationInput] = useState(locationQuery || '')

  const reset = useCallback(() => {
    setLocationInput('')
  }, [setLocationInput])

  return (
    <HoliModalContentWrapper
      actionButtonText={t('donations:search.submitButton')}
      onActionButtonPress={() => onSubmit(locationInput)}
      style={styles.modalWrapper}
      testID="donations-search-modal"
      scrollable={false}
    >
      <View style={styles.container}>
        <View style={styles.headingRow}>
          <HoliHeading>{t('donations:search.heading')}</HoliHeading>
          <HoliButton
            transparent
            inline
            label={t('search.filter.reset')}
            onPress={reset}
            testID="donations-search-form-reset"
          >
            <HoliText size="small" style={{ color: colors.fontColorGrey }}>
              {t('search.filter.reset')}
            </HoliText>
          </HoliButton>
        </View>
        <PlacesAutocomplete
          value={locationInput}
          label={t('donations:search.location.label')}
          placeholder={t('donations:search.location.placeholder')}
          inputProps={{ autoFocus: true }}
          testID="donations-search-location"
          id="donations-search-location"
          onSubmit={onSubmit}
          onChange={setLocationInput}
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
    height: '100%',
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
})
