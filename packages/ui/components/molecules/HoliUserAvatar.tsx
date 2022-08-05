import * as React from 'react'
import {
  AccessibilityProps,
  Image,
  ImageSourcePropType,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import tinycolor from 'tinycolor2'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

// See accessibility hints: https://www.w3.org/WAI/tutorials/images/informative/
// https://usability.yale.edu/web-accessibility/articles/images#image-guidelines

type AccessibleComponentProps<T> = AccessibilityProps & T

export type AvatarProps = {
  imageSrc: string | undefined
  nameLabel: string
  defaultColor: string
  initials: string
  size?: 'micro' | 'small' | 'medium' | 'large' | 'extralarge'
  testID?: string
  style?: StyleProp<ViewStyle>
}

export const sizes = {
  micro: 25,
  small: 40,
  medium: 65,
  large: 80,
  extralarge: 123,
}

const HoliUserAvatar: React.VFC<AccessibleComponentProps<AvatarProps>> = ({
  size = 'medium',
  defaultColor,
  imageSrc,
  initials,
  nameLabel,
  style,
  accessible = true,
  accessibilityLabel,
  accessibilityRole = 'image',
  ...props
}) => {
  const width = sizes[size || 'medium']
  const hasImage = !!imageSrc
  const styles = getStyles(width, defaultColor, hasImage)
  const imageUri: ImageSourcePropType = { uri: imageSrc }
  const sizeClass = size || 'medium'

  const accessibilityProps: AccessibilityProps & { accessibilityPressed?: boolean } = {
    accessibilityLabel: accessibilityLabel || nameLabel,
    accessible,
    accessibilityRole,
  }

  return (
    <View {...props} style={[styles.holiUserAvatar, style, styles[sizeClass]]}>
      {hasImage ? (
        <Image source={imageUri} style={{ width: width, height: width }} {...accessibilityProps} />
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
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: imageIsAvailable ? colors.backgroundColorGrey : defaultColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micro: {
      width: width,
      height: width,
    },
    small: {
      width: width,
      height: width,
    },
    medium: {
      width: width,
      height: width,
    },
    large: {
      width: width,
      height: width,
      borderWidth: 2,
      borderColor: colors.softblack,
    },
    extralarge: {
      width: width,
      height: width,
      borderWidth: 2,
      borderColor: colors.softblack,
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
