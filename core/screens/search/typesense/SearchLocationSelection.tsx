import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import PlacesAutocomplete, {
  type GeolocationSuggestion,
  GeolocationLevel,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { ChipAction } from 'holi-bricks/components/chips'
import { ArrowLeft, CloseCircleFilled, Edit2 } from '@holi/icons/src/generated'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

export interface SearchLocationSelectionProps {
  currentLocation?: GeolocationSuggestion
  onLocationChange: (location?: GeolocationSuggestion) => void
  disabled?: boolean
}

export const SearchLocationSelection = ({
  currentLocation,
  onLocationChange,
  disabled = false,
}: SearchLocationSelectionProps) => {
  const { t } = useTranslation()
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(currentLocation)

  const [locationModalVisible, setLocationModalVisible] = useState(false)
  const { styles } = useStyles(stylesheet)

  const onSave = () => {
    onLocationChange(selectedLocation)
    setLocationModalVisible(false)
  }

  const openLocationModal = () => setLocationModalVisible(true)
  const closeLocationModal = () => setLocationModalVisible(false)
  const label = disabled
    ? t('search.location.germanyWide')
    : (currentLocation?.label ?? t('search.location.germanyWide'))

  return (
    <>
      <ChipAction iconTrailing={Edit2} onPress={openLocationModal} color="white" disabled={disabled}>
        {label}
      </ChipAction>
      <HoliModal
        shown={locationModalVisible}
        onDismiss={closeLocationModal}
        label={t('search.location.filter')}
        relativeHeight={0.4}
        autoHeight={false}
        backgroundColor={styles.container.backgroundColor}
      >
        <HoliContainer>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <PlacesAutocomplete
                label={t('search.location.label')}
                id="search-location-input"
                placeholder={t('search.location.placeholder')}
                level={GeolocationLevel.CITY}
                selected={selectedLocation}
                onChange={setSelectedLocation}
                inputProps={{ autoFocus: true }}
                clearInputComponent={
                  <Pressable
                    onPress={() => setSelectedLocation(undefined)}
                    accessibilityLabel={t('search.typesense.input.clear')}
                    testID="search-location-clear"
                    accessibilityRole="button"
                  >
                    <HoliIcon icon={CloseCircleFilled} size={22} />
                  </Pressable>
                }
              />
              <View style={styles.buttonContainer}>
                <ButtonIcon
                  label={t('search.location.closeSelection')}
                  variant="secondary"
                  onPress={closeLocationModal}
                  testID={'modal-close-btn'}
                  icon={ArrowLeft}
                />
                <View style={styles.saveButton}>
                  <Button label={t('search.location.save')} onPress={onSave} />
                </View>
              </View>
            </View>
          </View>
        </HoliContainer>
      </HoliModal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.page,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing['3xs'],
  },
  saveButton: {
    flex: 1,
  },
}))
