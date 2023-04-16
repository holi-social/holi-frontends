import { useLazyQuery } from '@apollo/client'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, TextInputProps, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { GeoPlacesResponse, geoPlacesQuery } from '@holi/core/location/queries'
import { Geolocation } from '@holi/core/types'
import HoliAutocomplete, { Suggestion } from '@holi/ui/components/molecules/HoliAutocomplete'
import { useDebounce } from '@holi/ui/helper'

const PLACE_SUGGESTION_DEBOUNCE = 500
const PLACE_SUGGESTION_MAX_COUNT = 3

export type GeolocationSuggestion = Suggestion & {
  coordinates?: Geolocation
}

export interface PlacesAutocompleteProps {
  selected?: GeolocationSuggestion
  onChangeText?: (text: string) => void
  onSubmit?: (selected: GeolocationSuggestion) => void
  onChange?: (selected: GeolocationSuggestion) => void
  onClose?: (selected?: GeolocationSuggestion) => void
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

const PlacesAutocomplete = React.forwardRef<View, PlacesAutocompleteProps>(
  (
    {
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
      onClose,
      style,
      suggestionsStyle,
      withCoordinates,
      value,
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [fetchSuggestions, { loading, error, data, called }] = useLazyQuery<GeoPlacesResponse>(geoPlacesQuery, {
      variables: {
        limit: PLACE_SUGGESTION_MAX_COUNT,
      },
    })
    const debouncedFetchSuggestions = useDebounce(fetchSuggestions, PLACE_SUGGESTION_DEBOUNCE)

    if (error) {
      logError(error, `[PlacesAutocomplete.tsx] ${error.message}`)
    }

    const placeSuggestions = (data?.geo_placesAutocomplete || [])
      .map(({ id, name, coordinates }) => ({
        id,
        value: name,
        label: name,
        coordinates,
      }))
      .slice(0, PLACE_SUGGESTION_MAX_COUNT)

    const getSuggestions = useCallback(
      (value: string) => {
        const selectedSuggestion = placeSuggestions.find((suggestion) => suggestion.value === value)

        selectedSuggestion && onChange?.(selectedSuggestion)
        onChangeText?.(value)

        if (value && !selectedSuggestion) {
          debouncedFetchSuggestions({
            variables: {
              text: value,
            },
          })
        }
      },
      [debouncedFetchSuggestions, onChange, onChangeText, placeSuggestions]
    )

    const onAutocompleteClose = useCallback(
      (suggestion?: Suggestion) => onClose?.(placeSuggestions.find((s) => s.id == suggestion?.id)),
      [placeSuggestions, onClose]
    )

    const submit = useCallback(
      (id: string) => {
        if (onSubmit) {
          const selectedSuggestion = placeSuggestions.find((suggestion) => suggestion.id === id)
          selectedSuggestion && onSubmit(selectedSuggestion)
        }
      },
      [onSubmit, placeSuggestions]
    )

    // Trigger loading suggestions for initial value
    useEffect(() => {
      if (!called && (value || selected?.label)) {
        getSuggestions(value || '')
      }
    }, [called, selected, getSuggestions, value])

    const noResultsText = useMemo(() => {
      return !loading && called && data && !placeSuggestions.length && value
        ? t('location.placesAutocomplete.noResults')
        : undefined
    }, [t, loading, called, data, placeSuggestions, value])

    // TODO: fix autofocus
    return (
      <HoliAutocomplete
        loading={loading}
        onChange={getSuggestions}
        suggestions={placeSuggestions}
        inputLabel={label}
        accessibilityLabel={label}
        placeholder={placeholder}
        value={withCoordinates ? selected?.label : value}
        trailingIcon="search"
        inputProps={inputProps}
        onSubmit={submit}
        onSelect={onChange}
        onClose={onAutocompleteClose}
        testID={testID}
        validationErrorText={
          validationErrorText ? validationErrorText : error?.message && t('location.placesAutocomplete.error')
        }
        helperText={noResultsText || helperText}
        id={id}
        style={style}
        suggestionsStyle={suggestionsStyle}
        ref={ref}
      />
    )
  }
)
PlacesAutocomplete.displayName = 'PlacesAutocomplete'

export default PlacesAutocomplete
