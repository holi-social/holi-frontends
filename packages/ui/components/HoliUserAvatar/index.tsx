import * as React from 'react'
import { AccessibilityProps, Image, ImageSourcePropType, Platform, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

// See accessibility hints: https://www.w3.org/WAI/tutorials/images/informative/
// https://usability.yale.edu/web-accessibility/articles/images#image-guidelines

export type AvatarProps = {
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
  imageSrc: string | undefined
  userName: string
  size?: 'micro' | 'small' | 'medium' | 'large' | 'extralarge'
  testID?: string
}

const HoliUserAvatar: React.FunctionComponent<AvatarProps> = (props: AvatarProps) => {
  const { theme } = useTheme()
  const sizes = {
    micro: 30,
    small: 50,
    medium: 65,
    large: 80,
    extralarge: 123,
  }
  const width = sizes[props.size || 'medium']
  const styles = getStyles(theme, width)
  const imageUri: ImageSourcePropType = { uri: props.imageSrc }
  const sizeClass = props.size || 'medium'

  const accessibilityProps: AccessibilityProps & { accessibilityPressed?: boolean } = {
    accessible: true,
    accessibilityLabel: props.userName,
  }

  // TODO: default image

  return (
    <View style={[styles.holiUserAvatar, props.style, styles[sizeClass]]} {...props}>
      {props.imageSrc && <Image source={imageUri} style={{ width: width, height: width }} {...accessibilityProps} />}
    </View>
  )
}

export default HoliUserAvatar

const getStyles = (theme: HoliTheme, width: number) =>
  StyleSheet.create({
    holiUserAvatar: {
      ...Platform.select({
        web: {
          display: 'inline-block',
        },
      }),
      borderRadius: width / 2,
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: theme.colors.backgroundColorGrey,
      overflow: 'hidden',
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
      borderWidth: 1,
      borderColor: theme.colors.softblack,
    },
    extralarge: {
      width: width,
      height: width,
      borderWidth: 1,
      borderColor: theme.colors.softblack,
    },
  })
