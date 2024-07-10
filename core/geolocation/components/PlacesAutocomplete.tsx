import { useLazyQuery } from '@apollo/client'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, TextInputProps, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import {
  GeoPlaceDetailsResponse,
  GeoPlacesResponse,
  geoPlaceDetailsQuery,
  geoPlacesQuery,
} from '@holi/core/geolocation/queries'
import { GeolocationGeoJSON, GeolocationPoint } from '@holi/core/types'
import { Search } from '@holi/icons/src/generated'
import HoliAutocomplete, { Suggestion } from '@holi/ui/components/molecules/HoliAutocomplete'
import { useDebounce } from '@holi/ui/helper'

const PLACE_SUGGESTION_DEBOUNCE = 500
const PLACE_SUGGESTION_MAX_COUNT = 3

export type GeolocationSuggestion = Suggestion & {
  coordinates?: GeolocationPoint
  geolocation?: GeolocationGeoJSON
}

export enum GeolocationLevel {
  CITY = 'city',
}

export interface PlacesAutocompleteProps {
  selected?: GeolocationSuggestion
  onChangeText?: (text: string) => void
  onSubmit?: (selected?: GeolocationSuggestion) => void
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
  value?: string
  level?: GeolocationLevel
  fetchDetailsOnClose?: boolean
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
      value,
      level,
      fetchDetailsOnClose,
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [fetchSuggestions, { loading, error, data, called }] = useLazyQuery<GeoPlacesResponse>(geoPlacesQuery, {
      variables: {
        limit: PLACE_SUGGESTION_MAX_COUNT,
        level,
      },
      onError: (error) =>
        logError(error, 'Failed to fetch places suggestions', {
          location: 'PlacesAutocomplete.fetchSuggestions',
          query: geoPlacesQuery,
        }),
    })
    const debouncedFetchSuggestions = useDebounce(fetchSuggestions, PLACE_SUGGESTION_DEBOUNCE)
    const [fetchPlaceDetails] = useLazyQuery<GeoPlaceDetailsResponse>(geoPlaceDetailsQuery)

    const placeSuggestions = (data?.geo_placesAutocomplete || [])
      .map(({ id, name, city, state, country, coordinates }) => ({
        id,
        value: name,
        label: name,
        city: city,
        state: state,
        country: country,
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
      async (suggestion?: Suggestion) => {
        if (!onClose || !suggestion) {
          return
        }

        const selection = placeSuggestions.find(
          ({ label, id }) => !!suggestion?.label && (id === suggestion?.id || label.startsWith(suggestion.label))
        )

        if (selection && fetchDetailsOnClose) {
          return fetchPlaceDetails({ variables: { id: selection.id } })
            .then((response) =>
              onClose({
                ...selection,
                geolocation: response.data?.geo_placeDetails.geolocation,
              })
            )
            .catch((error) => {
              logError(error, 'Failed to fetch place details', {
                location: 'PlacesAutocomplete.fetchPlaceDetails',
                placeId: selection.id,
              })
              return onClose(undefined)
            })
        }
        return onClose(selection)
      },
      [placeSuggestions, onClose, fetchDetailsOnClose, fetchPlaceDetails]
    )

    const onSubmitHandler = useCallback(
      (value: string) => {
        const selectedSuggestion = placeSuggestions.find(({ label }) =>
          label.toLowerCase().startsWith(value.toLowerCase())
        )
        onSubmit?.(selectedSuggestion)
        selectedSuggestion && onChangeText?.(selectedSuggestion.label)
      },
      [onChangeText, onSubmit, placeSuggestions]
    )

    const onBlurHandler = useCallback(
      (value: string) => {
        // check complete match
        const matchedSuggestion = placeSuggestions.find(({ label }) => label === value)
        onSubmit?.(matchedSuggestion)
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
        aria-label={label}
        placeholder={placeholder}
        value={value}
        trailingIcon={Search}
        inputProps={inputProps}
        onSubmit={onSubmitHandler}
        onSelect={onChange}
        onClose={onAutocompleteClose}
        onBlur={onBlurHandler}
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
