import * as React from 'react'
import { ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceAvatarProps = {
  label: string
  imageSrc?: string
  width?: number
  testID?: string
  style?: StyleProp<ViewStyle>
}

const SpaceAvatar = ({ label, imageSrc, width = 64, testID, style }: SpaceAvatarProps) => {
  const styles = getStyles(width)
  const imageUri: ImageSourcePropType = { uri: imageSrc }

  return (
    <View style={[styles.spaceAvatar, style]} testID={testID || 'space-avatar'}>
      <HoliImage label={label} source={imageUri} style={styles.image} />
    </View>
  )
}

export default React.memo(SpaceAvatar)

const getStyles = (width: number) =>
  StyleSheet.create({
    spaceAvatar: {
      borderRadius: 8,
      backgroundColor: colors.backgroundColorGrey,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      width,
      height: width,
      borderWidth: 2,
      borderColor: colors.softblack,
      maxWidth: 128,
      maxHeight: 128,
    },
    image: {
      height: '100%',
      width: '100%',
    },
  })
