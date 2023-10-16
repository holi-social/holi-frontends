import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { PlacesAutocompleteProps } from '@holi/core/geolocation/components/PlacesAutocomplete'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export interface SpaceLocationInputProps extends Partial<PlacesAutocompleteProps> {
  title: string
  description: string
  validationErrorText?: string
  onChange: (selected: GeolocationSuggestion) => void
  onLocationClose?: () => void
  onChangeText?: (text: string) => void
  location?: GeolocationSuggestion
}

const SpaceLocationInput: React.VFC<SpaceLocationInputProps> = ({
  title,
  description,
  validationErrorText,
  onChange,
  onLocationClose,
  onChangeText,
  location,
}: SpaceLocationInputProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <HoliText size="extralarge" style={styles.title}>
        {title}
      </HoliText>
      <HoliText style={styles.subTitle}>{description}</HoliText>
      <PlacesAutocomplete
        label={t('spaces.input.location.label')}
        placeholder={t('spaces.input.location.placeholder')}
        selected={location}
        value={location?.label}
        id="spaces-location-input"
        testID="spaces-location"
        onChange={onChange}
        onSubmit={onChange}
        onClose={onLocationClose}
        onChangeText={onChangeText}
        style={[styles.input, { zIndex: 2 }]}
        inputProps={{ autoFocus: true }}
        validationErrorText={validationErrorText}
        helperText={location ? undefined : t('spaces.input.location.validation.helper')}
        suggestionsStyle={styles.suggestionsContainer}
        fetchDetailsOnClose
      />
    </View>
  )
}

export default SpaceLocationInput
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background20,
    paddingBottom: 50,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  title: {
    marginTop: 24,
  },
  subTitle: {
    marginBottom: 32,
    marginTop: 16,
    color: colors.foreground20,
  },
  input: {
    marginBottom: 16,
  },
  suggestionsContainer: {
    backgroundColor: colors.background10,
  },
})
