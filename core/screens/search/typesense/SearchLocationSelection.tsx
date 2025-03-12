import React, { useState } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import PlacesAutocomplete, {
  type GeolocationSuggestion,
  GeolocationLevel,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { ChipAction } from 'holi-bricks/components/chips'
import { Edit2 } from '@holi/icons/src/generated'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { useConnector } from 'react-instantsearch-core'
import { connectConfigure } from 'instantsearch.js/es/connectors'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import { BorderRadius, Spacing } from 'holi-bricks/tokens'

export interface SearchLocationSelectionProps {
  initialSelection?: GeolocationSuggestion
  onLocationChange: (location?: GeolocationSuggestion) => void
}

export const SearchLocationSelection = ({ initialSelection, onLocationChange }: SearchLocationSelectionProps) => {
  const { t } = useTranslation()
  const germanyWideLabel = t('search.germanyWide')
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(initialSelection)
  const [locationName, setLocationName] = useState(selectedLocation?.label ?? germanyWideLabel)
  const [locationFilter, setLocationFilter] = useState(selectedLocation)

  useConnector(connectConfigure, {
    searchParameters: {
      filters: locationFilter
        ? `location_lat_lng:(${locationFilter?.coordinates?.latitude}, ${locationFilter?.coordinates?.longitude}, 1 km)`
        : '',
    },
  })

  // const inputRef = useRef<TextInput | null>(null)

  // Modal visibility
  const [locationModalVisible, setLocationModalVisible] = useState(false)
  const { styles } = useStyles(stylesheet)

  const onSave = () => {
    if (!selectedLocation) {
      onLocationChange(undefined)
      setLocationName(germanyWideLabel)
      setLocationFilter(undefined)
    } else {
      onLocationChange(selectedLocation)
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

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.container, // e.g. or theme.colors.bg.page
    borderTopLeftRadius: BorderRadius.lg,
    // or Spacing.md, etc.
    padding: Spacing.xs,
  },
  inputContainer: {
    backgroundColor: theme.colors.bg.container,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing['3xs'],
    paddingVertical: Spacing['4xs'],
    marginBottom: Spacing['xs'],
  },
}))
