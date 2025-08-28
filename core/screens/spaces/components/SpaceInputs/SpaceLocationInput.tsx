import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { PlacesAutocompleteProps } from '@holi/core/geolocation/components/PlacesAutocomplete'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface SpaceLocationInputProps extends Partial<PlacesAutocompleteProps> {
  description: string
  validationErrorText?: string
  onChange?: (selected?: GeolocationSuggestion) => void
  location?: GeolocationSuggestion
}

const SpaceLocationInput = ({ description, validationErrorText, onChange, location }: SpaceLocationInputProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.container}>
      <HoliText style={styles.subTitle}>{description}</HoliText>
      <PlacesAutocomplete
        label={t('spaces.input.location.label')}
        placeholder={t('spaces.input.location.placeholder')}
        selected={location}
        id="spaces-location-input"
        testID="spaces-location"
        onChange={onChange}
        style={[styles.input, { zIndex: 2 }]}
        inputProps={{ autoFocus: true, clearButtonMode: 'always' }}
        validationErrorText={validationErrorText}
        helperText={t('spaces.input.location.validation.helper')}
        suggestionsStyle={styles.suggestionsContainer}
        enhanceWithDetails
      />
    </View>
  )
}

export default SpaceLocationInput

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background20,
      paddingTop: 24,
      paddingBottom: 50,
      ...Platform.select({
        native: {
          maxWidth: '100%',
        },
      }),
    },
    subTitle: {
      marginBottom: 32,
      color: theme.colors.foreground20,
    },
    input: {
      marginBottom: 16,
    },
    suggestionsContainer: {
      backgroundColor: theme.colors.background10,
    },
  })
