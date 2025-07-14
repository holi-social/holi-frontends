import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, type StyleProp, type TextInputProps, type View, type ViewStyle } from 'react-native'

import type { GeolocationGeoJSON, GeolocationPoint } from '@holi/core/types'
import { CloseCircleFilled, Search } from '@holi/icons/src/generated'
import HoliAutocomplete, { type Suggestion } from '@holi/ui/components/molecules/HoliAutocomplete'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { usePlacesAutocomplete } from '@holi/core/geolocation/hooks/usePlacesAutocomplete'

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
  allowClearingInput?: boolean
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
      allowClearingInput,
    },
    ref
  ) => {
    const { t } = useTranslation()

    const {
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
    } = usePlacesAutocomplete({
      selected,
      onSubmit,
      onChange,
      level,
      enhanceWithDetails,
    })

    const clearInputComponent = useMemo(
      () => (
        <Pressable
          onPress={onClear}
          accessibilityLabel={t('location.placesAutocomplete.clear')}
          accessibilityRole="button"
        >
          <HoliIcon icon={CloseCircleFilled} size={22} />
        </Pressable>
      ),
      [onClear, t]
    )

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
        clearInputComponent={allowClearingInput ? clearInputComponent : undefined}
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
