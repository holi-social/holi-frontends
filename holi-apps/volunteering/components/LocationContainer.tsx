import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import HoliText, { HoliTextSize } from '@holi/ui/components/atoms/HoliText'
import { useTheme } from '@holi/ui/styles/theme'

type LocationContainerProps = {
  locationName: string
  iconSize?: number
  iconColor?: string
  fontSize?: HoliTextSize
  fontColor?: string
}

const LocationContainer: React.FC<LocationContainerProps> = ({
  locationName,
  iconSize = 14,
  iconColor,
  fontSize = 'small',
  fontColor,
}: LocationContainerProps) => {
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View style={styles.container}>
      <HoliIcon icon={Globe} size={iconSize} color={iconColor || colors.foreground20} style={styles.locationIcon} />
      <HoliText size={fontSize} style={{ color: fontColor || colors.foreground20 }}>
        {locationName}
      </HoliText>
    </View>
  )
}

export default LocationContainer

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 5,
  },
})
