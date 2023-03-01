import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

export interface SpaceLocationInputProps {
  title: string
  description: string
  onChange: (selected: GeolocationSuggestion) => void
  location?: GeolocationSuggestion
}

const SpaceLocationInput: React.VFC<SpaceLocationInputProps> = ({
  title,
  description,
  onChange,
  location,
}: SpaceLocationInputProps) => {
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()

  const updateLocation = (suggestion: GeolocationSuggestion) => {
    console.log('updateLocation', suggestion)
    onChange(suggestion)
  }
  return (
    <View style={[styles.container, { minHeight: deviceHeight }]}>
      <HoliText size="extralarge" style={styles.title}>
        {title}
      </HoliText>
      <HoliText style={styles.subTitle}>{description}</HoliText>
      <PlacesAutocomplete
        label={t('spaces.input.location.label')}
        placeholder={t('spaces.input.location.placeholder')}
        selected={location}
        id="spaces-input-location"
        testID="spaces-input-location"
        onChange={updateLocation}
        onSubmit={updateLocation}
        style={[styles.input, { zIndex: 2 }]}
        inputProps={{ autoFocus: true }}
        useMainTextOnly={true}
        suggestionsStyle={styles.suggestionsContainer}
      />
    </View>
  )
}

export default SpaceLocationInput
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 132,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  title: {
    marginTop: 40,
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
