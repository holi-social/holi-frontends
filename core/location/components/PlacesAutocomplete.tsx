import { useLazyQuery } from '@apollo/client'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, TextInputProps, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { GeoPlacesResponse, geoPlacesQuery } from '@holi/core/location/queries'
import HoliAutocomplete from '@holi/ui/components/molecules/HoliAutocomplete'
import { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

const PLACE_SUGGESTION_DEBOUNCE = 500

type PlacesAutocompleteProps = {
  value?: string
  onSubmit?: (locationQuery: string) => void
  onChange?: (locationQuery: string) => void
  testID?: string
  id: string
  label: string
  placeholder: string
  inputProps?: TextInputProps
  style?: StyleProp<ViewStyle>
}

const PlacesAutocomplete: React.VFC<PlacesAutocompleteProps> = ({
  onSubmit,
  value,
  testID,
  id,
  label,
  placeholder,
  inputProps,
  onChange,
  style,
}: PlacesAutocompleteProps) => {
  const { t } = useTranslation()
  const [locationInput, setLocationInput] = useState(value || '')
  const submit = useCallback(
    (input) => {
      onSubmit && onSubmit(input)
    },
    [onSubmit]
  )
  const [placeSuggestions, setPlaceSuggestions] = useState<HoliSelectOption[]>([])

  // Handle reset from outside
  useEffect(() => {
    if (!value) {
      setLocationInput('')
      setPlaceSuggestions([])
    }
  }, [value])

  const [fetchSuggestions, { loading, error, data, called }] = useLazyQuery<GeoPlacesResponse>(geoPlacesQuery, {
    variables: {
      input: locationInput,
    },
  })

  if (error) {
    logError(error, `[PlacesAutocomplete.tsx] ${error.message}`)
  }

  const getSuggestions = useCallback(
    (input: string) => {
      setLocationInput(input)
      onChange && onChange(input)
      if (input) {
        fetchSuggestions()
      } else {
        setPlaceSuggestions([])
      }
    },
    [setLocationInput, fetchSuggestions, setPlaceSuggestions, onChange]
  )

  // Trigger loading suggestions for initial value
  useEffect(() => {
    if (value && !called) {
      getSuggestions(value)
    }
  }, [called, value, getSuggestions])

  useEffect(() => {
    // keep displaying previous suggestions while loading to prevent flickering
    if (loading) {
      return
    }
    const places = data?.geo_places || []
    const newPlaces = places.map(({ description }) => ({
      id: description,
      title: description,
      selected: description === value,
    }))
    setPlaceSuggestions(newPlaces)
  }, [loading, data, value, setPlaceSuggestions])

  return (
    <HoliAutocomplete
      loading={loading}
      onChange={getSuggestions}
      debounce={PLACE_SUGGESTION_DEBOUNCE}
      suggestions={placeSuggestions}
      inputLabel={label}
      accessibilityLabel={label}
      placeholder={placeholder}
      value={value}
      trailingIcon="search"
      inputProps={inputProps}
      onSubmit={submit}
      testID={testID}
      validationErrorText={error?.message && t('location.placesAutocomplete.error')}
      noResultsText={t('location.placesAutocomplete.noResults')}
      id={id}
      style={style}
    />
  )
}

export default PlacesAutocomplete
