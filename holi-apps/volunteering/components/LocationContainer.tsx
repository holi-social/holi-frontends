import { Text, TextSize } from 'holi-bricks/components/text/Text'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import { useTheme } from '@holi/ui/styles/theme'

type LocationContainerProps = {
  locationName: string
  iconSize?: number
  iconColor?: string
  fontSize?: TextSize
  fontColor?: string
}

const LocationContainer: React.FC<LocationContainerProps> = ({
  locationName,
  iconSize = 14,
  iconColor,
  fontSize = 'sm',
  fontColor,
}: LocationContainerProps) => {
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View style={styles.container}>
      <HoliIcon icon={Globe} size={iconSize} color={iconColor || colors.foreground20} style={styles.locationIcon} />
      <Text size={fontSize} color={fontColor || colors.foreground20}>
        {locationName}
      </Text>
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
