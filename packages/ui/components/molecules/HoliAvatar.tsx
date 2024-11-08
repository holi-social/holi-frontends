import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityProps, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { PropsWithSkeleton } from '@holi/ui/components/types'
import { useTheme } from '@holi/ui/styles/theme'

// See accessibility hints: https://www.w3.org/WAI/tutorials/images/informative/
// https://usability.yale.edu/web-accessibility/articles/images#image-guidelines

export type AvatarSize = 'micro' | 'small' | 'medium' | 'large' | 'extralarge'
export type AvatarShape = 'circle' | 'square'

export interface AvatarProps {
  imageSrc?: string
  imageBlurhash?: string
  'aria-hidden'?: boolean
  size?: AvatarSize
  shape?: AvatarShape
  defaultColor?: string
  testID?: string
  style?: StyleProp<ViewStyle>
  initialsFontWeight?: TextStyle['fontWeight']
  initialsColor?: string
  label: string
  initials: string
  fontSize?: number
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
  shape = 'circle',
  defaultColor,
  imageSrc,
  imageBlurhash,
  initials,
  label,
  'aria-hidden': ariaHidden,
  style,
  loading = false,
  initialsColor,
  initialsFontWeight = 'bold',
  fontSize,
  ...props
}: PropsWithSkeleton<AvatarProps>) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const width = sizes[size]
  const hasImage = !!imageSrc

  const accessibilityPropsInitials: AccessibilityProps = {
    accessible: false,
    'aria-label': label || t('user.profileForm.avatar'),
    ...(ariaHidden ? { 'aria-hidden': ariaHidden } : {}),
    role: 'img',
  }
  // initial font size is 45% of avatar width
  const initialsFontSize = width * 0.45

  return (
    <View
      {...props}
      style={[
        styles.wrapper,
        {
          borderRadius: shape === 'circle' ? width / 2 : width * 0.15,
          backgroundColor: hasImage ? colors.background20 : defaultColor || colors.background10,
          borderColor: ['large', 'extralarge'].includes(size) ? colors.foreground30 : undefined,
          borderWidth: ['medium', 'large'].includes(size) ? 1 : size === 'extralarge' ? 2 : 0,
          width,
          height: width,
        },
        style,
        loading && { borderWidth: 0 },
      ]}
    >
      {loading && <HoliSkeleton height={'100%'} width={'100%'} borderRadius={0} />}
      {!loading && hasImage && (
        <HoliImage
          label={label ?? ''} // only null when loading
          aria-hidden={ariaHidden}
          source={{ uri: imageSrc, width, height: width }}
          blurhash={imageBlurhash}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      {!loading && !hasImage && (
        <HoliText
          style={[
            styles.inititals,
            {
              color: initialsColor
                ? initialsColor
                : tinycolor(defaultColor || colors.background10).isLight()
                  ? colors.dark
                  : colors.light,
              fontSize: fontSize ? fontSize : initialsFontSize,
              fontWeight: initialsFontWeight,
              lineHeight: initialsFontSize * 1.2,
            },
          ]}
          {...accessibilityPropsInitials}
        >
          {initials}
        </HoliText>
      )}
    </View>
  )
}

export default memo(HoliAvatar)

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  inititals: {
    textTransform: 'uppercase',
  },
})
