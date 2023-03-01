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
  onSubmit?: (selected: GeolocationSuggestion) => void
  onChange?: (selected: GeolocationSuggestion) => void
  testID?: string
  id: string
  label: string
  placeholder: string
  inputProps?: TextInputProps
  validationErrorText?: string
  style?: StyleProp<ViewStyle>
  useMainTextOnly?: boolean
  suggestionsStyle?: StyleProp<ViewStyle>
  withCoordinates?: boolean
}

const PlacesAutocomplete: React.VFC<PlacesAutocompleteProps> = ({
  onSubmit,
  selected,
  testID,
  id,
  label,
  placeholder,
  inputProps,
  validationErrorText,
  onChange,
  style,
  useMainTextOnly = false,
  suggestionsStyle,
}: PlacesAutocompleteProps) => {
  const { t } = useTranslation()
  const [locationInput, setLocationInput] = useState(selected?.value || '')
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

  // Handle reset from outside
  useEffect(() => {
    if (!selected) {
      setLocationInput('')
      setPlaceSuggestions([])
    }
  }, [selected])

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
      const selectedSuggestion = placeSuggestions.find((suggestion) => suggestion.id === id)
      onChange && selectedSuggestion && onChange(selectedSuggestion)
      if (id) {
        fetchSuggestions()
      } else {
        setPlaceSuggestions([])
      }
    },
    [setLocationInput, fetchSuggestions, setPlaceSuggestions, onChange, id, placeSuggestions]
  )

  // Trigger loading suggestions for initial value
  useEffect(() => {
    if (selected && !called) {
      getSuggestions(selected?.value || '')
    }
  }, [called, selected, getSuggestions])

  useEffect(() => {
    // keep displaying previous suggestions while loading to prevent flickering
    if (loading) {
      return
    }
    const places = data?.geo_placesAutocomplete || []

    const newPlaces = places.map(({ id, name, city, coordinates }) => ({
      id,
      value: useMainTextOnly && city ? city : name,
      label: name,
      coordinates,
    }))
    setPlaceSuggestions(newPlaces.slice(0, PLACE_SUGGESTION_MAX_COUNT))
  }, [loading, data, setPlaceSuggestions, useMainTextOnly])

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
      value={selected?.value}
      trailingIcon="search"
      inputProps={inputProps}
      onSubmit={submit}
      onSelect={onChange}
      testID={testID}
      validationErrorText={
        validationErrorText ? validationErrorText : error?.message && t('location.placesAutocomplete.error')
      }
      helperText={noResultsText}
      id={id}
      style={style}
      suggestionsStyle={suggestionsStyle}
    />
  )
}

export default PlacesAutocomplete
