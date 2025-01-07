import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
// eslint-disable-next-line no-restricted-imports
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { type AccessibilityProps, accessibilityProps } from 'holi-bricks/accessibility'
import { getAvatarColorBg } from 'holi-bricks/components/avatar/getAvatarColorBg'
import { Text } from 'holi-bricks/components/text/Text'
import { useStyles } from 'holi-bricks/hooks'
import { BorderRadius, Spacing } from 'holi-bricks/tokens'
import { BorderWidth } from 'holi-bricks/tokens/dimensions/borderWidth'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

/*
  xl: 128
  lg: 64
  md: 48
  sm: 40
  xs: 24
*/
export const AvatarSizesValues = {
  xl: 128,
  lg: 64,
  md: 48,
  sm: 40,
  xs: 24,
}
export type AvatarSizes = keyof typeof AvatarSizesValues
export type AvatarShape = 'square' | 'circle'
export type AvatarBorder = 'strong' | 'light'
export type AvatarProps = AccessibilityProps & {
  border?: AvatarBorder
  shape?: AvatarShape
  size?: AvatarSizes
  label?: string
  icon?: HoliIconType
  imgSrc?: string
  initials: string
  testID?: string
  imgPlaceholder?: string
}

const avatarSizeToTextSize = {
  xs: 'xxs',
  sm: 'md',
  md: 'xxl',
  lg: '3xl',
  xl: '4xl',
} as const

export const Avatar = ({
  label,
  size = 'md',
  border = 'strong',
  shape = 'circle',
  imgSrc,
  initials,
  testID,
  imgPlaceholder,
  icon,
  ...rest
}: AvatarProps) => {
  const { styles } = useStyles(stylesheet, { border, shape, size })
  const [errorLoading, setErrorLoading] = useState(false)
  const handleImageError = useCallback(() => setErrorLoading(true), [])

  const QUADRATIC_IMAGE_SIDE_LENGTH_FOR_CDN_RESIZING_AND_CROPPING = AvatarSizesValues[size]

  const renderContent = () => {
    if (!errorLoading && imgSrc) {
      return (
        <HoliImage
          style={styles.webImage}
          resizeMode={'cover'}
          label={label || ''}
          blurhash={imgPlaceholder}
          source={{
            uri: imgSrc,
            width: QUADRATIC_IMAGE_SIDE_LENGTH_FOR_CDN_RESIZING_AND_CROPPING,
            height: QUADRATIC_IMAGE_SIDE_LENGTH_FOR_CDN_RESIZING_AND_CROPPING,
          }}
          onError={handleImageError}
        />
      )
    }
    if (icon) {
      return <HoliIcon accessibilityLabel={label} icon={icon} color={styles.text.color} />
    }
    return (
      <View style={styles.textWrapper}>
        <Text color={styles.text.color} size={avatarSizeToTextSize[size]}>
          {initials?.substring(0, 2)?.toUpperCase()}
        </Text>
      </View>
    )
  }

  return (
    <View {...accessibilityProps(rest)} style={styles.avatar(initials)} testID={testID}>
      {renderContent()}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  textWrapper: {
    opacity: 0.8,
  },
  text: {
    color: theme.components.avatar.text,
  },
  webImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  avatar: (initials) => {
    const bgs = Object.values(theme.components.avatar.bg)
    const getBg = getAvatarColorBg(bgs, initials)

    return {
      position: 'relative',
      overflow: 'hidden',
      borderWidth: BorderWidth.sm,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: getBg,
      variants: {
        border: {
          strong: {
            borderColor: theme.components.avatar.strong,
          },
          light: {
            borderColor: theme.components.avatar.light,
          },
        },
        shape: {
          circle: {
            borderRadius: BorderRadius.pill,
          },
          square: {
            borderRadius: BorderRadius.xs,
          },
        },
        size: {
          xl: {
            width: Spacing['4xl'] * 2,
            height: Spacing['4xl'] * 2,
          },
          lg: {
            width: Spacing['4xl'],
            height: Spacing['4xl'],
          },
          md: {
            width: Spacing['xxl'],
            height: Spacing['xxl'],
          },
          sm: {
            width: Spacing['xl'],
            height: Spacing['xl'],
          },
          xs: {
            width: Spacing['md'],
            height: Spacing['md'],
          },
        },
      },
    }
  },
}))
