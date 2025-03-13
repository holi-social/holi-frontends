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
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import { BorderRadius, Spacing } from 'holi-bricks/tokens'

export interface SearchLocationSelectionProps {
  currentLocation?: GeolocationSuggestion
  onLocationChange: (location?: GeolocationSuggestion) => void
}

export const SearchLocationSelection = ({ currentLocation, onLocationChange }: SearchLocationSelectionProps) => {
  const { t } = useTranslation()
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(currentLocation)

  // const inputRef = useRef<TextInput | null>(null)

  const [locationModalVisible, setLocationModalVisible] = useState(false)
  const { styles } = useStyles(stylesheet)

  const onSave = () => {
    onLocationChange(selectedLocation)
    setLocationModalVisible(false)
  }

  const openLocationModal = () => setLocationModalVisible(true)
  const closeLocationModal = () => {
    setLocationModalVisible(false)
  }

  return (
    <>
      <ChipAction iconTrailing={Edit2} onPress={openLocationModal} color="white">
        {currentLocation?.label ?? t('search.germanyWide')}
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
