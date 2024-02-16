import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityProps, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

// See accessibility hints: https://www.w3.org/WAI/tutorials/images/informative/
// https://usability.yale.edu/web-accessibility/articles/images#image-guidelines

export type AvatarSize = 'micro' | 'small' | 'medium' | 'large' | 'extralarge'
export type AvatarShape = 'circle' | 'square'

interface BaseProps {
  imageSrc?: string
  imageBlurhash?: string
  'aria-hidden'?: boolean
  size?: AvatarSize
  shape?: AvatarShape
  defaultColor?: string
  testID?: string
  style?: StyleProp<ViewStyle>
  initialsFontWeight?: TextStyle['fontWeight']
  initialsColor?: keyof typeof colors
}

interface Props extends BaseProps {
  label: string
  initials: string
  loading?: boolean
}

interface SkeletonProps extends BaseProps {
  label?: string
  initials?: string
  loading: boolean
}

export type AvatarProps = Props | SkeletonProps

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
  defaultColor = colors.background10,
  imageSrc,
  imageBlurhash,
  initials,
  label,
  'aria-hidden': ariaHidden,
  style,
  loading = false,
  initialsColor,
  initialsFontWeight = 'bold',
  ...props
}: AvatarProps) => {
  const { t } = useTranslation()
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
          backgroundColor: hasImage ? colors.background20 : defaultColor,
          borderColor: ['large', 'extralarge'].includes(size) ? colors.foreground30 : undefined,
          borderWidth: ['large', 'extralarge'].includes(size) ? 2 : size === 'medium' ? 1 : 0,
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
                ? colors[initialsColor]
                : tinycolor(defaultColor).isLight()
                ? colors.foreground30
                : colors.background10,
              fontSize: initialsFontSize,
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

export default React.memo(HoliAvatar)

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
