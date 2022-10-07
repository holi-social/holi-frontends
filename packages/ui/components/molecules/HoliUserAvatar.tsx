import * as React from 'react'
import { AccessibilityProps, Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

// See accessibility hints: https://www.w3.org/WAI/tutorials/images/informative/
// https://usability.yale.edu/web-accessibility/articles/images#image-guidelines

export type AvatarProps = {
  imageSrc: string | undefined
  label: string
  defaultColor: string
  initials: string
  size?: 'micro' | 'small' | 'medium' | 'large' | 'extralarge'
  testID?: string
  style?: StyleProp<ViewStyle>
}

export const sizes = {
  micro: 24,
  small: 40,
  medium: 52,
  large: 64,
  extralarge: 128,
}

const HoliUserAvatar = ({ size = 'medium', defaultColor, imageSrc, initials, label, style, ...props }: AvatarProps) => {
  const width = sizes[size || 'medium']
  const hasImage = !!imageSrc
  const styles = getStyles(width, defaultColor, hasImage)
  const imageUri: ImageSourcePropType = { uri: imageSrc }
  const sizeClass = size || 'medium'

  const accessibilityProps: AccessibilityProps & { accessibilityPressed?: boolean } = {
    accessible: false,
    accessibilityLabel: label,
    accessibilityRole: 'image',
  }

  return (
    <View {...props} style={[styles.holiUserAvatar, style, styles[sizeClass]]}>
      {hasImage ? (
        <Image source={imageUri} style={styles.image} {...accessibilityProps} />
      ) : (
        <HoliText style={styles.inititals} {...accessibilityProps}>
          {initials}
        </HoliText>
      )}
    </View>
  )
}

export default HoliUserAvatar

const getStyles = (width: number, defaultColor: string, imageIsAvailable: boolean) => {
  const initialsFontSize = (width / 10) * 4.5
  return StyleSheet.create({
    holiUserAvatar: {
      borderRadius: width / 2,
      backgroundColor: imageIsAvailable ? colors.backgroundColorGrey : defaultColor,
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
    inititals: {
      fontSize: initialsFontSize,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      color: tinycolor(defaultColor).isLight() ? colors.fontColorBlack : colors.fontColorWhite,
      lineHeight: initialsFontSize * 1.2,
    },
  })
}
