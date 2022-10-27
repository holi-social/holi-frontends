import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

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

  const reset = () => {
    setLocationInput('')
  }

  return (
    <HoliModalContentWrapper
      actionButtonText={t('donations:search.submitButton')}
      onActionButtonPress={submit}
      style={styles.modalWrapper}
      testID="donations-search-modal"
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
        <HoliTextInput
          inputLabel={t('donations:search.location.label')}
          accessibilityLabel={t('donations:search.location.label')}
          placeholder={t('donations:search.location.placeholder')}
          value={locationInput}
          trailingIcon="search"
          onChange={setLocationInput}
          inputProps={{ autoFocus: true, onSubmitEditing: submit }}
          testID="donations-search-location"
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
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
})
