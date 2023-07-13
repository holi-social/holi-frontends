import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
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
  iconColor = colors.foreground20,
  fontSize = 'small',
  fontColor = colors.foreground20,
}: LocationContainerProps) => {
  return (
    <View style={styles.container}>
      <HoliIcon icon={Globe} size={iconSize} color={iconColor} style={styles.locationIcon} />
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
