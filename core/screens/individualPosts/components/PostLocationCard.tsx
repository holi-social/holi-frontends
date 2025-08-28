import React, { useMemo } from 'react'
import { Linking, Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import type { GeolocationPoint } from '@holi/core/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, ExternalLink, MapPinLine, Pencil } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ButtonIcon } from 'holi-bricks/components/button'

const PostLocationCard = ({
  location,
  removeLocation,
  editLocation,
  geolocation,
}: {
  location: string
  removeLocation?: () => void
  editLocation?: () => void
  geolocation?: GeolocationPoint
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const handleOpenMap = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${geolocation?.latitude},${geolocation?.longitude}`,
      android: `geo:0,0?q=${geolocation?.latitude},${geolocation?.longitude}`,
      default: `https://www.google.com/maps/search/?api=1&query=${geolocation?.latitude},${geolocation?.longitude}`,
    })

    if (Platform.OS === 'web') {
      window.open(url, '_blank')
    } else {
      Linking.openURL(url)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <HoliIcon icon={MapPinLine} size={24} style={{ paddingTop: 2 }} />
        <HoliText style={styles.label} size={'small'} bold>
          {location}
        </HoliText>
      </View>
      {removeLocation || editLocation ? (
        <View style={styles.buttonContainer}>
          <ButtonIcon variant="secondary" onPress={removeLocation} label={'remove-location'} icon={Delete} size="sm" />
          <ButtonIcon variant="secondary" onPress={editLocation} label={'edit-location'} icon={Pencil} size="sm" />
        </View>
      ) : (
        <ButtonIcon transparent onPress={handleOpenMap} label={'edit-location'} icon={ExternalLink} />
      )}
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      padding: Spacing.xxs,
      borderWidth: 1,
      borderColor: theme.colors.defaultBorder,
      borderRadius: Spacing['3xs'],
      backgroundColor: theme.colors.background10,
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
      alignContent: 'center',
      borderWidth: 1,
      borderRadius: 84,
      width: 32,
      height: 32,
    },
    buttonContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.xxs,
      marginLeft: Spacing.xxs,
    },
    share: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
      height: 24,
      top: 2,
    },
    icon: {
      alignSelf: 'center',
    },
  })

export default PostLocationCard
