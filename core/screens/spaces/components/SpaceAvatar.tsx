import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

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

  return (
    <View style={[styles.spaceAvatar, style]} testID={testID || 'space-avatar'}>
      {!!imageSrc && <HoliImage label={label} source={{ uri: imageSrc }} style={styles.image} />}
    </View>
  )
}

export default React.memo(SpaceAvatar)

const getStyles = (width: number) =>
  StyleSheet.create({
    spaceAvatar: {
      borderRadius: 8,
      backgroundColor: colors.background20,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      width,
      height: width,
      borderWidth: 2,
      borderColor: colors.foreground30,
      maxWidth: 128,
      maxHeight: 128,
    },
    image: {
      height: '100%',
      width: '100%',
    },
  })
