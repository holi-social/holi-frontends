import React, { useState } from 'react'
import { Platform, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import PlacesAutocomplete, {
  type GeolocationSuggestion,
  GeolocationLevel,
} from '@holi/core/geolocation/components/PlacesAutocomplete'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { ChipAction } from 'holi-bricks/components/chips'
import { ArrowLeft, Edit2 } from '@holi/icons/src/generated'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
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

  const buttonLabel = selectedLocation ? t('search.location.save') : t('search.location.save.germanyWide')

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
        autoHeight={true}
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
                allowClearingInput
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
                  <Button label={buttonLabel} onPress={onSave} />
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
    flexShrink: 1,
    height: '100%',
    backgroundColor: theme.colors.bg.main,
    ...Platform.select({
      web: {
        minHeight: 400,
      },
    }),
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
  saveButton: {
    flex: 1,
  },
}))
