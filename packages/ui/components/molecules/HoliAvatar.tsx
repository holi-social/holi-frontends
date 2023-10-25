import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
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
  'aria-label'?: string
  size?: AvatarSize
  shape?: AvatarShape
  defaultColor?: string
  testID?: string
  style?: StyleProp<ViewStyle>
}

interface Props extends BaseProps {
  label: string
  initials: string
  loading?: false
}

interface SkeletonProps extends BaseProps {
  label?: string
  initials?: string
  loading: true
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
  defaultColor = colors.background20,
  imageSrc,
  imageBlurhash,
  initials,
  label,
  'aria-label': ariaLabel,
  style,
  loading = false,
  ...props
}: AvatarProps) => {
  const { t } = useTranslation()
  const width = sizes[size || 'medium']
  const hasImage = !!imageSrc
  const styles = getStyles(shape, width, defaultColor, hasImage)
  const sizeClass = size || 'medium'

  const accessibilityPropsInitials: AccessibilityProps = {
    accessible: false,
    'aria-label': label || ariaLabel || t('user.profileForm.avatar'),
    role: 'img',
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
        <HoliImage
          label={label ?? ''} // only null when loading
          source={{ uri: imageSrc, width, height: width }}
          blurhash={imageBlurhash}
          style={styles.image}
          resizeMode="cover"
        />
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

const getStyles = (shape: AvatarShape, width: number, defaultColor: string, imageIsAvailable: boolean) => {
  const initialsFontSize = (width / 10) * 4.5

  return StyleSheet.create({
    wrapper: {
      borderRadius: shape === 'circle' ? width / 2 : width * 0.15,
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
      borderWidth: 1,
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
