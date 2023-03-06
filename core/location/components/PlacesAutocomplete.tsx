import { useLazyQuery } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, TextInputProps, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { GeoPlacesResponse, geoPlacesQuery } from '@holi/core/location/queries'
import HoliAutocomplete, { Suggestion } from '@holi/ui/components/molecules/HoliAutocomplete'

const PLACE_SUGGESTION_DEBOUNCE = 500
const PLACE_SUGGESTION_MAX_COUNT = 3

export type GeolocationSuggestion = Suggestion & {
  value?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

interface PlacesAutocompleteProps {
  selected?: GeolocationSuggestion
  onChangeText?: (text: string) => void
  onSubmit?: (selected: GeolocationSuggestion) => void
  onChange?: (selected: GeolocationSuggestion) => void
  testID?: string
  id: string
  label: string
  placeholder: string
  inputProps?: TextInputProps
  validationErrorText?: string
  helperText?: string
  style?: StyleProp<ViewStyle>
  suggestionsStyle?: StyleProp<ViewStyle>
  withCoordinates?: boolean
  value?: string
}

const PlacesAutocomplete: React.VFC<PlacesAutocompleteProps> = ({
  onSubmit,
  selected,
  onChangeText,
  testID,
  id,
  label,
  placeholder,
  inputProps,
  validationErrorText,
  helperText,
  onChange,
  style,
  suggestionsStyle,
  withCoordinates,
  value,
}: PlacesAutocompleteProps) => {
  const { t } = useTranslation()
  const [locationInput, setLocationInput] = useState(selected?.value || value)
  const [placeSuggestions, setPlaceSuggestions] = useState<GeolocationSuggestion[]>([])
  const submit = useCallback(
    (id: string) => {
      if (onSubmit) {
        const selectedSuggestion = placeSuggestions.find((suggestion) => suggestion.id === id)
        selectedSuggestion && onSubmit(selectedSuggestion)
      }
    },
    [onSubmit, placeSuggestions]
  )

  const [fetchSuggestions, { loading, error, data, called }] = useLazyQuery<GeoPlacesResponse>(geoPlacesQuery, {
    variables: {
      text: locationInput,
      limit: PLACE_SUGGESTION_MAX_COUNT,
    },
  })

  if (error) {
    logError(error, `[PlacesAutocomplete.tsx] ${error.message}`)
  }

  const getSuggestions = useCallback(
    (value: string) => {
      setLocationInput(value)
      const selectedSuggestion = placeSuggestions.find((suggestion) => suggestion.id === value)
      onChange && selectedSuggestion && onChange(selectedSuggestion)
      onChangeText && onChangeText(value)
      if (value) {
        fetchSuggestions()
      } else {
        setPlaceSuggestions([])
      }
    },
    [setLocationInput, fetchSuggestions, setPlaceSuggestions, onChange, placeSuggestions, onChangeText]
  )

  // Trigger loading suggestions for initial value
  useEffect(() => {
    if (!called && (value || selected?.value)) {
      getSuggestions(value || '')
    }
  }, [called, selected, getSuggestions, value])

  useEffect(() => {
    // keep displaying previous suggestions while loading to prevent flickering
    if (loading) {
      return
    }
    const places = data?.geo_placesAutocomplete || []

    const newPlaces = places.map(({ id, name, coordinates }) => ({
      id,
      value: name,
      label: name,
      coordinates,
    }))
    setPlaceSuggestions(newPlaces.slice(0, PLACE_SUGGESTION_MAX_COUNT))
  }, [loading, data, setPlaceSuggestions])

  const noResultsText = useMemo(() => {
    return !loading && locationInput && !placeSuggestions.length
      ? t('location.placesAutocomplete.noResults')
      : undefined
  }, [t, loading, locationInput, placeSuggestions])

  // TODO: fix autofocus
  return (
    <HoliAutocomplete
      loading={loading}
      onChange={getSuggestions}
      debounce={PLACE_SUGGESTION_DEBOUNCE}
      suggestions={placeSuggestions}
      inputLabel={label}
      accessibilityLabel={label}
      placeholder={placeholder}
      value={withCoordinates ? selected?.value : value}
      trailingIcon="search"
      inputProps={inputProps}
      onSubmit={submit}
      onSelect={onChange}
      testID={testID}
      validationErrorText={
        validationErrorText ? validationErrorText : error?.message && t('location.placesAutocomplete.error')
      }
      helperText={noResultsText || helperText}
      id={id}
      style={style}
      suggestionsStyle={suggestionsStyle}
    />
  )
}

export default PlacesAutocomplete
