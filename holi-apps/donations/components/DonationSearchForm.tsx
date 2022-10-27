import { useLazyQuery } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAutocomplete, { Suggestion } from '@holi/ui/components/molecules/HoliAutocomplete'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { colors } from '@holi/ui/styles/globalVars'

import { AppDonationsPlacesResponse, placesQuery } from '@holi-apps/donations/queries'

const PLACE_SUGGESTION_DEBOUNCE = 500
const PLACE_SUGGESTION_MAX_COUNT = 3

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
  const submit = useCallback(() => {
    onSubmit && onSubmit(locationInput)
  }, [onSubmit, locationInput])
  const [placeSuggestions, setPlaceSuggestions] = useState<Suggestion[]>([])

  const [fetchSuggestions, { loading, error, data }] = useLazyQuery<AppDonationsPlacesResponse>(placesQuery, {
    variables: {
      input: locationInput,
    },
  })

  if (error) {
    logError(error, `[DonationSearchForm.tsx] ${error.message}`)
  }

  const reset = useCallback(() => {
    setLocationInput('')
    setPlaceSuggestions([])
    Keyboard.dismiss()
  }, [setLocationInput, setPlaceSuggestions])

  const getSuggestions = useCallback(
    (input: string) => {
      setLocationInput(input)
      if (input) {
        fetchSuggestions()
      } else {
        setPlaceSuggestions([])
      }
    },
    [setLocationInput, fetchSuggestions]
  )

  useEffect(() => {
    if (loading) {
      return
    }
    const places = data?.appDonations_places || []
    const newPlaces = places.map(({ description, mainTextMatchedSubstrings }) => ({
      id: description,
      label: description,
      highlights: mainTextMatchedSubstrings,
    }))
    setPlaceSuggestions(newPlaces.slice(0, PLACE_SUGGESTION_MAX_COUNT))
  }, [loading, data])

  const noResultsText = useMemo(() => {
    return !loading && locationInput && !placeSuggestions.length
      ? t('donations:search.location.autocomplete.noResults')
      : undefined
  }, [t, loading, locationInput, placeSuggestions])

  return (
    <HoliModalContentWrapper
      actionButtonText={t('donations:search.submitButton')}
      onActionButtonPress={submit}
      style={styles.modalWrapper}
      testID="donations-search-modal"
      keyboardShouldPersistTaps="always"
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
        <HoliAutocomplete
          loading={loading}
          onChange={getSuggestions}
          debounce={PLACE_SUGGESTION_DEBOUNCE}
          suggestions={placeSuggestions}
          inputLabel={t('donations:search.location.label')}
          accessibilityLabel={t('donations:search.location.label')}
          placeholder={t('donations:search.location.placeholder')}
          value={locationInput}
          trailingIcon="search"
          inputProps={{ autoFocus: true, onSubmitEditing: submit }}
          testID="donations-search-location"
          validationErrorText={error?.message && t('donations:search.location.autocomplete.error')}
          helperText={noResultsText}
          id="donations-search-location"
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
