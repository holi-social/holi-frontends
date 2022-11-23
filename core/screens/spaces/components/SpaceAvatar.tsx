import * as React from 'react'
import { AccessibilityProps, Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export type SpaceAvatarProps = {
  label: string
  imageSrc?: string
  size?: 'micro' | 'small' | 'medium' | 'large' | 'extralarge'
  testID?: string
  style?: StyleProp<ViewStyle>
}

const sizes = {
  micro: 24,
  small: 40,
  medium: 52,
  large: 64,
  extralarge: 128,
}

const SpaceAvatar = ({ size = 'large', imageSrc, label, style, ...props }: SpaceAvatarProps) => {
  const width = sizes[size]
  const styles = getStyles(width)
  const imageUri: ImageSourcePropType = { uri: imageSrc }

  const accessibilityProps: AccessibilityProps & { accessibilityPressed?: boolean } = {
    accessible: false,
    accessibilityLabel: label,
    accessibilityRole: 'image',
  }

  return (
    <View {...props} style={[styles.spaceAvatar, style, styles[size]]}>
      <Image source={imageUri} style={styles.image} {...accessibilityProps} />
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
    },
    micro: {
      width,
      height: width,
    },
    small: {
      width,
      height: width,
    },
    medium: {
      width,
      height: width,
    },
    large: {
      width,
      height: width,
      borderWidth: 2,
      borderColor: colors.softblack,
    },
    extralarge: {
      width,
      height: width,
      borderWidth: 2,
      borderColor: colors.softblack,
    },
    image: {
      height: '100%',
      width: '100%',
    },
  })
