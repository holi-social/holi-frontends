import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/accessibility'
import { getAvatarColorBg } from 'holi-bricks/components/avatar/getAvatarColorBg'
import { Text } from 'holi-bricks/components/text/Text'
import { useStyles } from 'holi-bricks/hooks'
import { BorderRadius, Spacing } from 'holi-bricks/tokens'
import { BorderWidth } from 'holi-bricks/tokens/dimensions/borderWidth'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
// eslint-disable-next-line no-restricted-imports
import HoliImage from '@holi/ui/components/atoms/HoliImage'

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

const avatarSizeToIconSize = {
  xs: 14,
  sm: 20,
  md: 24,
  lg: 24,
  xl: 32,
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

  const renderContent = () => {
    if (!errorLoading && imgSrc) {
      return (
        <HoliImage
          label={label || ''}
          blurhash={imgPlaceholder}
          source={{
            uri: imgSrc,
            width: avatarSizeToIconSize[size],
            height: avatarSizeToIconSize[size],
          }}
          onError={handleImageError}
        />
      )
    }
    if (icon) {
      return (
        <HoliIcon accessibilityLabel={label} icon={icon} size={avatarSizeToIconSize[size]} color={styles.text.color} />
      )
    }
    return (
      <View style={styles.textWrapper} testID={testID}>
        <Text color={styles.text.color} size={avatarSizeToTextSize[size]}>
          {initials?.substring(0, 2)?.toUpperCase()}
        </Text>
      </View>
    )
  }

  return (
    <View {...accessibilityProps(rest)} style={styles.avatar(initials)}>
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
  avatar: (initials) => {
    const bgs = Object.values(theme.components.avatar.bg)
    const getBg = getAvatarColorBg(bgs, initials)

    return {
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
