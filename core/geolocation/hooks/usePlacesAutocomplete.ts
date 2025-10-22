import { useLazyQuery } from '@apollo/client'
import { logError } from '@holi/core/errors/helpers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  geoPlaceDetailsQuery,
  type GeoPlacesResponse,
  type GeoPlaceDetailsResponse,
  geoPlacesQuery,
} from '@holi/core/geolocation/queries'
import { useDebounce } from '@holi/ui/helper'
import type { Suggestion } from '@holi/ui/components/molecules/HoliAutocomplete'
import { useTranslation } from 'react-i18next'
import type { GeolocationLevel, GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useApolloErrorLogging } from '@holi/core/hooks/useApolloErrorLogging'

const PLACE_SUGGESTION_DEBOUNCE = 500
const PLACE_SUGGESTION_MAX_COUNT = 3

type PlacesAutocompleteOption = GeolocationSuggestion & {
  value: string
}

interface UsePlacesAutocompleteProps {
  selected?: GeolocationSuggestion
  onSubmit?: () => void
  onChange?: (selected?: GeolocationSuggestion) => void
  level?: GeolocationLevel
  enhanceWithDetails?: boolean
}

export const usePlacesAutocomplete = ({
  selected,
  onSubmit,
  onChange,
  level,
  enhanceWithDetails,
}: UsePlacesAutocompleteProps) => {
  const { t } = useTranslation()

  const [value, setValue] = useState(selected?.label || '')
  const [called, setCalled] = useState(false)

  const [fetchSuggestions, { loading, error, data }] = useLazyQuery<GeoPlacesResponse>(geoPlacesQuery, {
    variables: {
      limit: PLACE_SUGGESTION_MAX_COUNT,
      level,
    },
  })
  const debouncedFetchSuggestions = useDebounce(fetchSuggestions, PLACE_SUGGESTION_DEBOUNCE)
  const [fetchPlaceDetails] = useLazyQuery<GeoPlaceDetailsResponse>(geoPlaceDetailsQuery)

  const placeSuggestions: PlacesAutocompleteOption[] = (data?.geo_placesAutocomplete || [])
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
      setCalled(true)
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

  const onClear = useCallback(() => {
    setValue('')
    changeSelection(undefined)
  }, [changeSelection])

  // Trigger loading suggestions for initial value
  useEffect(() => {
    if (!called && value) {
      getSuggestions(value)
    }
  }, [called, getSuggestions, value])

  useEffect(() => {
    setValue(selected?.label || '')
  }, [selected?.label])

  useApolloErrorLogging(error, 'Failed to fetch places suggestions', {
    location: 'PlacesAutocomplete.fetchSuggestions',
    query: geoPlacesQuery,
  })

  const noResultsText = useMemo(() => {
    return !loading && called && data && !placeSuggestions.length && value
      ? t('location.placesAutocomplete.noResults')
      : undefined
  }, [t, loading, called, data, placeSuggestions, value])

  return {
    loading,
    error,
    getSuggestions,
    placeSuggestions,
    value,
    onClose,
    onBlurHandler,
    onSubmitHandler,
    onClear,
    noResultsText,
  }
}
