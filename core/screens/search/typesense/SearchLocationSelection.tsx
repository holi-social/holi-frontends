import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import PlacesAutocomplete, {
  type GeolocationSuggestion,
  GeolocationLevel,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import { mono } from 'holi-bricks/tokens'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { ChipAction } from 'holi-bricks/components/chips'
import { Edit2 } from '@holi/icons/src/generated'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { useConnector } from 'react-instantsearch-core'
import { connectConfigure } from 'instantsearch.js/es/connectors'

export interface SearchLocationSelectionProps {
  onLocationChange: (location: string | undefined) => void
}

export const SearchLocationSelection = ({ onLocationChange }: SearchLocationSelectionProps) => {
  const { t } = useTranslation()
  const germanyWideLabel = t('search.germanyWide')
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(undefined)
  const [locationName, setLocationName] = useState(selectedLocation?.label ?? germanyWideLabel)
  const [locationFilter, setLocationFilter] = useState(selectedLocation)
  useConnector(connectConfigure, {
    searchParameters: {
      filters: locationFilter
        ? `location_lat_lng:(${locationFilter?.coordinates?.latitude}, ${locationFilter?.coordinates?.longitude}, 30 km)`
        : '',
    },
  })

  // const inputRef = useRef<TextInput | null>(null)

  // Modal visibility
  const [locationModalVisible, setLocationModalVisible] = useState(false)

  const onSave = () => {
    if (!selectedLocation) {
      onLocationChange(undefined)
      setLocationName(germanyWideLabel)
      setLocationFilter(undefined)
    } else {
      const { latitude, longitude } = selectedLocation.coordinates ?? {}

      onLocationChange(`${latitude},${longitude}`)
      setLocationName(selectedLocation.label)
      setLocationFilter(selectedLocation)
    }
    // Close modal
    setLocationModalVisible(false)
  }

  // Called when user taps 'Back'
  const closeLocationModal = () => {
    setLocationModalVisible(false)
  }

  return (
    <>
      <ChipAction iconTrailing={Edit2} onPress={() => setLocationModalVisible(true)}>
        {locationName}
      </ChipAction>
      <HoliModal
        shown={locationModalVisible}
        onDismiss={closeLocationModal}
        label={t('search.locationFilter')}
        relativeHeight={0.8}
        autoHeight={false}
      >
        <HoliModalContentWrapper
          actionButtonText={t('search.saveLocationButton')}
          onActionButtonPress={onSave}
          // style={styles.modalWrapper}
          // testID="volunteering-filter-modal"
          // keyboardShouldPersistTaps="handled"
          // scrollable={false}
          // hideFooterWhenKeyboardIsOpen={true}
        >
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <PlacesAutocomplete
                label={t('search.locationLabel')}
                id="user-location-input"
                placeholder={t('search.locationPlaceholder')}
                level={GeolocationLevel.CITY}
                selected={selectedLocation}
                onChange={setSelectedLocation}
              />
            </View>

            {/* <NavigationButtons
            onBackPress={closeLocationModal}
            onNextPress={onSave}
            nextButtonLabel={t('search.saveLocationButton')}
          /> */}
          </View>
        </HoliModalContentWrapper>
      </HoliModal>
    </>
  )
}

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
