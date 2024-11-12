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
// eslint-disable-next-line no-restricted-imports
import type { ImageSource } from '@holi/ui/components/atoms/HoliImage/types'

type AvatarSizes = 'lg' | 'md' | 'sm' | 'xs'

type AvatarProps = AccessibilityProps & {
  border?: 'strong' | 'light'
  shape?: 'squared' | 'circle'
  size?: AvatarSizes
  label?: string
  icon?: HoliIconType
  imgSrc?: ImageSource
  initials: string
}

const avatarSizeToIconSize = {
  xs: 14,
  sm: 20,
  md: 24,
  lg: 24,
}

const avatarSizeToTextSize = {
  xs: 'xxs',
  sm: 'md',
  md: 'xxl',
  lg: '3xl',
} as const

export const Avatar = ({
  label,
  size = 'md',
  border = 'strong',
  shape = 'squared',
  imgSrc,
  initials,
  icon,
  ...rest
}: AvatarProps) => {
  const { styles } = useStyles(stylesheet, { border, shape, size })
  const [errorLoading, setErrorLoading] = useState(false)
  const handleImageError = useCallback(() => setErrorLoading(true), [])

  const renderContent = () => {
    if (!errorLoading && imgSrc) {
      return <HoliImage label={label || ''} source={imgSrc} onError={handleImageError} />
    }
    if (icon) {
      return (
        <HoliIcon accessibilityLabel={label} icon={icon} size={avatarSizeToIconSize[size]} color={styles.text.color} />
      )
    }
    return (
      <View style={styles.textWrapper}>
        <Text color={styles.text.color} size={avatarSizeToTextSize[size]}>
          {initials?.substring(0, 2)}
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
          squared: {
            borderRadius: BorderRadius.xs,
          },
        },
        size: {
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
