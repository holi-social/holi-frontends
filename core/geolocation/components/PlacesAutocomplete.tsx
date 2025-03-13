import { useLazyQuery } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type StyleProp, type TextInputProps, type View, type ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import {
  type GeoPlaceDetailsResponse,
  type GeoPlacesResponse,
  geoPlaceDetailsQuery,
  geoPlacesQuery,
} from '@holi/core/geolocation/queries'
import type { GeolocationGeoJSON, GeolocationPoint } from '@holi/core/types'
import { Search } from '@holi/icons/src/generated'
import HoliAutocomplete, { type Suggestion } from '@holi/ui/components/molecules/HoliAutocomplete'
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
  onSubmit?: () => void
  onChange?: (selected?: GeolocationSuggestion) => void
  testID?: string
  id: string
  label: string
  placeholder: string
  inputProps?: TextInputProps
  validationErrorText?: string
  helperText?: string
  style?: StyleProp<ViewStyle>
  suggestionsStyle?: StyleProp<ViewStyle>
  level?: GeolocationLevel
  enhanceWithDetails?: boolean
  clearInputComponent?: React.ReactElement
}

const PlacesAutocomplete = React.forwardRef<View, PlacesAutocompleteProps>(
  (
    {
      onSubmit,
      selected,
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
      level,
      enhanceWithDetails,
      clearInputComponent,
    },
    ref
  ) => {
    const { t } = useTranslation()

    const [value, setValue] = useState(selected?.label || '')

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
        setValue(value)
        const selectedSuggestion = placeSuggestions.find((suggestion) => suggestion.value === value)
        if (selectedSuggestion) {
          onChange?.(selectedSuggestion)
        }

        if (value && !selectedSuggestion) {
          debouncedFetchSuggestions({
            variables: {
              text: value,
            },
          })
        }
      },
      [debouncedFetchSuggestions, onChange, placeSuggestions]
    )

    const changeSelection = useCallback(
      async (selection?: GeolocationSuggestion) => {
        if (!onChange) {
          return
        }
        setValue(selection?.label || '')
        if (!selection || !enhanceWithDetails) {
          return onChange(selection)
        }
        return fetchPlaceDetails({ variables: { id: selection.id } })
          .then((response) =>
            onChange({
              ...selection,
              geolocation: response.data?.geo_placeDetails.geolocation,
            })
          )
          .catch((error) => {
            logError(error, 'Failed to fetch place details', {
              location: 'PlacesAutocomplete.fetchPlaceDetails',
              placeId: selection.id,
            })
            onChange(undefined)
            setValue('')
          })
      },
      [enhanceWithDetails, fetchPlaceDetails, onChange]
    )

    const onClose = useCallback(
      async (suggestion?: Suggestion) => {
        if (!onChange) {
          return
        }

        if (!suggestion && !value) {
          onChange(undefined)
          setValue('')
          return
        }

        // Keep previous selection if input not cleared
        const selection = suggestion?.label
          ? placeSuggestions.find(({ label, id }) => id === suggestion?.id || label.startsWith(suggestion?.label))
          : selected

        return changeSelection(selection)
      },
      [onChange, value, placeSuggestions, selected, changeSelection]
    )

    const onBlurHandler = useCallback(
      async (value: string) => {
        // check complete match
        const matchedSuggestion = placeSuggestions.find(({ label }) => label === value)
        await changeSelection(matchedSuggestion)
        onSubmit?.()
      },
      [changeSelection, onSubmit, placeSuggestions]
    )

    const onSubmitHandler = useCallback(
      async (value: string) => {
        const selectedSuggestion = value && placeSuggestions.length ? placeSuggestions[0] : undefined
        await changeSelection(selectedSuggestion)
        onSubmit?.()
      },
      [changeSelection, onSubmit, placeSuggestions]
    )

    // Trigger loading suggestions for initial value
    useEffect(() => {
      if (!called && value) {
        getSuggestions(value)
      }
    }, [called, getSuggestions, value])

    useEffect(() => {
      setValue(selected?.label || '')
    }, [selected?.label])

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
        clearInputComponent={clearInputComponent}
        inputProps={inputProps}
        onSubmit={onSubmitHandler}
        onSelect={onChange}
        onClose={onClose}
        onBlur={Platform.OS === 'web' ? undefined : onBlurHandler}
        testID={testID}
        validationErrorText={validationErrorText ?? (error?.message && t('location.placesAutocomplete.error'))}
        helperText={noResultsText ?? (selected ? undefined : helperText)}
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
