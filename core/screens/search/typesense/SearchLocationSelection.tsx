import React, { useRef, useEffect, useCallback, useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import PlacesAutocomplete, {
  GeolocationSuggestion,
  GeolocationLevel,
  type PlacesAutocompleteProps,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { mono } from 'holi-bricks/tokens'
import NavigationButtons from '@holi/ui/components/organisms/HoliStepperV2/NavigationButtons'

export interface LocationSelectionProps
  extends Pick<PlacesAutocompleteProps, 'selected' | 'validationErrorText' | 'testID'> {
  onChange?: (latLngString: string | null, label?: string) => void
  autoFocus?: boolean
  onBackPress?: () => void
  onSavePress?: () => void
}

const LocationSelection = ({
  testID = 'location-selection',
  selected,
  onChange,
  validationErrorText,
  autoFocus,
  onBackPress,
  onSavePress,
}: LocationSelectionProps) => {
  const { t } = useTranslation()
  // Keep local state for lat/lng and label
  const [tempLatLng, setTempLatLng] = useState<string | null>(null)
  const [tempLabel, setTempLabel] = useState<string | undefined>()

  const inputRef = useRef<TextInput | null>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // On place pick, just store in local state
  const handlePlaceChange = useCallback((selection?: GeolocationSuggestion) => {
    if (!selection) {
      setTempLatLng(null)
      setTempLabel(undefined)
      return
    }
    const lat = selection.coordinates?.latitude
    const lng = selection.coordinates?.longitude
    const label = selection.city || 'Bundesweit'

    if (typeof lat === 'number' && typeof lng === 'number') {
      setTempLatLng(`${lat},${lng}`)
      setTempLabel(label)
    } else {
      setTempLatLng(null)
      setTempLabel(undefined)
    }
  }, [])

  // Only call parent’s onChange when user taps Save
  const handleSave = useCallback(() => {
    if (onChange) {
      onChange(tempLatLng, tempLabel)
    }
    onSavePress?.()
  }, [onChange, onSavePress, tempLatLng, tempLabel])

  return (
    <View testID={testID} style={styles.container}>
      <View style={styles.inputContainer}>
        <PlacesAutocomplete
          label={t('search.locationLabel')}
          id="user-location-input"
          testID={`${testID}-autocomplete`}
          placeholder={t('search.locationPlaceholder')}
          enhanceWithDetails
          level={GeolocationLevel.CITY}
          validationErrorText={validationErrorText}
          selected={selected}
          onChange={handlePlaceChange}
        />
      </View>

      <NavigationButtons
        onBackPress={onBackPress}
        onNextPress={handleSave}
        nextButtonLabel={t('search.saveLocationButton')}
        testID={`${testID}-nav-buttons`}
      />
    </View>
  )
}

export default LocationSelection

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mono[100],
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 16,
  },
})
