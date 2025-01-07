import React, { useMemo } from 'react'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import { GeolocationPoint } from '@holi/core/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, ExternalLink, MapPinLine, Pencil } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
          <HoliButton transparent onPress={removeLocation} label={'remove-location'} style={styles.button}>
            <HoliIcon icon={Delete} size={16} style={styles.icon} />
          </HoliButton>
          <HoliButton transparent onPress={editLocation} label={'edit-location'} style={styles.button}>
            <HoliIcon icon={Pencil} size={16} style={styles.icon} />
          </HoliButton>
        </View>
      ) : (
        <HoliButton transparent onPress={handleOpenMap} label={'edit-location'} style={styles.share}>
          <HoliIcon icon={ExternalLink} size={20} color={theme.colors.gray300} style={styles.icon} />
        </HoliButton>
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
