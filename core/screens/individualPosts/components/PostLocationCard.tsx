import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, MapPinLine, Pencil } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const PostLocationCard = ({
  location,
  removeLocation,
  editLocation,
}: {
  location: GeolocationSuggestion
  removeLocation: () => void
  editLocation: () => void
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <HoliIcon icon={MapPinLine} size={24} />
        <Text style={styles.label}>{location.label}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <HoliButton transparent onPress={removeLocation} label={'remove-location'} style={styles.button}>
          <HoliIcon icon={Delete} size={16} />
        </HoliButton>
        <HoliButton transparent onPress={editLocation} label={'edit-location'} style={styles.button}>
          <HoliIcon icon={Pencil} size={16} />
        </HoliButton>
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      padding: Spacing.xxs,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      borderRadius: Spacing['3xs'],
      backgroundColor: 'white',
    },
    label: {
      alignSelf: 'center',
    },

    labelContainer: {
      flexDirection: 'row',
      gap: Spacing['3xs'],
      flex: 1,
      marginRight: Spacing.xxs,
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      padding: Spacing['3xs'],
      borderRadius: 84,
      width: 32,
      height: 32,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: Spacing.xxs,
      marginLeft: Spacing.xxs,
    },
  })

export default PostLocationCard
