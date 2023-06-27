import * as React from 'react'
import { AccessibilityProps, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

// See accessibility hints: https://www.w3.org/WAI/tutorials/images/informative/
// https://usability.yale.edu/web-accessibility/articles/images#image-guidelines

export type AvatarProps = {
  imageSrc: string | undefined
  label: string
  accessibilityLabel?: string
  defaultColor: string
  initials: string
  imageBlurhash?: string
  size?: 'micro' | 'small' | 'medium' | 'large' | 'extralarge'
  testID?: string
  style?: StyleProp<ViewStyle>
  loading?: boolean
}

export const sizes = {
  micro: 24,
  small: 40,
  medium: 52,
  large: 64,
  extralarge: 128,
}

const HoliAvatar = ({
  size = 'medium',
  defaultColor,
  imageSrc,
  imageBlurhash,
  initials,
  label,
  accessibilityLabel,
  style,
  loading = false,
  ...props
}: AvatarProps) => {
  const width = sizes[size || 'medium']
  const hasImage = !!imageSrc
  const styles = getStyles(width, defaultColor, hasImage)
  const imageUri: ImageSourcePropType = { uri: imageSrc, width }
  const sizeClass = size || 'medium'

  const accessibilityPropsInitials: AccessibilityProps = {
    accessible: false,
    accessibilityLabel: label || accessibilityLabel,
    accessibilityRole: 'image',
  }

  return (
    <View
      {...props}
      style={[
        styles.wrapper,
        (size === 'large' || size === 'extralarge') && { borderColor: colors.foreground30 },
        style,
        styles[sizeClass],
      ]}
    >
      {loading && <HoliSkeleton height={'100%'} width={'100%'} borderRadius={0} />}
      {!loading && hasImage && (
        <HoliImage label={label} source={imageUri} blurhash={imageBlurhash} style={styles.image} resizeMode="cover" />
      )}
      {!loading && !hasImage && (
        <HoliText style={styles.inititals} {...accessibilityPropsInitials}>
          {initials}
        </HoliText>
      )}
    </View>
  )
}

export default React.memo(HoliAvatar)

const getStyles = (width: number, defaultColor: string, imageIsAvailable: boolean) => {
  const initialsFontSize = (width / 10) * 4.5
  return StyleSheet.create({
    wrapper: {
      borderRadius: width / 2,
      backgroundColor: imageIsAvailable ? colors.background20 : defaultColor,
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
    },
    extralarge: {
      width,
      height: width,
      borderWidth: 2,
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
    },
    inititals: {
      fontSize: initialsFontSize,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      color: tinycolor(defaultColor).isLight() ? colors.foreground30 : colors.background10,
      lineHeight: initialsFontSize * 1.2,
    },
  })
}
