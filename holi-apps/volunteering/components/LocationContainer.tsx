import React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText, { HoliTextSize } from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type LocationContainerProps = {
  locationName: string
  iconSize?: number
  iconColor?: string
  fontSize?: HoliTextSize
  fontColor?: string
}

const LocationContainer: React.VFC<LocationContainerProps> = ({
  locationName,
  iconSize = 14,
  iconColor = colors.fontColorGrey,
  fontSize = 'small',
  fontColor = colors.fontColorGrey,
}: LocationContainerProps) => {
  return (
    <View style={styles.container}>
      <HoliIcon icon="globe" size={iconSize} color={iconColor} style={styles.locationIcon} />
      <HoliText size={fontSize} style={{ color: fontColor }}>
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
