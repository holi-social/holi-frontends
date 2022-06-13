import * as React from 'react'
import { AccessibilityProps, Image, ImageSourcePropType, Platform, StyleSheet, View, ViewStyle } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/react-native-web'
// import SharedImage from '@holi/ui/components/sharedImage'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HeadingProps = {
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
  imageSrc: ImageSourcePropType | undefined
  userName: string
  size?: 'micro' | 'small' | 'medium' | 'large' | 'extralarge'
  testID?: string
}

const HoliUserAvatar: React.FunctionComponent<HeadingProps> = (props: HeadingProps) => {
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

  // const getAccessibilityProps = (): AccessibilityProps | AccessibilityPropsWeb =>
  //   Platform.select({
  //     native: { accessible: true },
  //     default: { accessible: true },
  //   })

  const accessibilityProps: AccessibilityProps & { accessibilityPressed?: boolean } = {
    accessible: true,
    // accessibilityRole: 'button',
    accessibilityLabel: props.userName,
  }

  return (
    <View style={[styles.holiUserAvatar, props.style, { width: width, height: width }]} {...props}>
      <Image source={props.imageSrc} style={{ width: width, height: width }} {...accessibilityProps} />
      {/* <SharedImage
        imageFile={require('@holi/ui/assets/img/dummyUser/Avatar_01.png')}
        style={{ width: width, height: width }}
        altText="Holi logo"
      /> */}
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
      borderWidth: 1,
      borderColor: '#0f0',
      borderRadius: width / 2,
      overflow: 'hidden',
    },
  })
