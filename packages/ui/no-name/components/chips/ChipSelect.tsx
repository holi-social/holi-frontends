import React, { ReactNode } from 'react'
import { GestureResponderEvent, Pressable } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Deselect, Select } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar, { AvatarProps } from '@holi/ui/components/molecules/HoliAvatar'
import Spacing from '@holi/ui/foundations/Spacing'
import { Color, byShade } from '@holi/ui/no-name/foundations/colors/primitives'

import { pill } from './styles'

type Size = 'sm' | 'md' | 'lg'

type ChipSelectProps = {
  onPress: (event: GestureResponderEvent) => void
  children?: ReactNode
  selected?: boolean
  disabled?: boolean
  selectedColor?: Color
  size?: Size
  avatar?: Pick<AvatarProps, 'initials' | 'label' | 'imageSrc' | 'imageBlurhash'>
}

const sizeToIconSize: Record<Size, number> = {
  sm: 12,
  md: 18,
  lg: 24,
}

const ChipSelect = ({
  onPress,
  children,
  selected = false,
  disabled = false,
  selectedColor = 'green',
  size = 'md',
  avatar,
}: ChipSelectProps) => {
  const { styles, theme } = useStyles(stylesheet, { size, selected, disabled })
  const iconSize = sizeToIconSize[size]
  const avatarSize = size === 'lg' ? 'small' : 'micro'

  return (
    <Pressable
      role="switch"
      aria-checked={selected}
      disabled={disabled}
      onPress={(e) => onPress?.(e)}
      style={({ hovered, focused }) => [styles.chip(!!hovered, !disabled && !!focused, selectedColor)]}
    >
      {avatar && (
        <HoliAvatar
          {...avatar}
          size={avatarSize}
          defaultColor={byShade('600')[selectedColor]}
          initialsColor={theme.components.chipSelect.text}
          style={styles.avatar}
        />
      )}
      {children && (
        <HoliText selectable={false} style={styles.text}>
          {children}
        </HoliText>
      )}
      {selected ? (
        <HoliIcon icon={Deselect} size={iconSize} color={styles.text.color} />
      ) : (
        <HoliIcon icon={Select} size={iconSize} color={styles.text.color} />
      )}
    </Pressable>
  )
}

export default ChipSelect

const stylesheet = createStyleSheet((theme) => ({
  chip: (hovered: boolean, focused: boolean, color: Color) => {
    return {
      ...pill,
      color: theme.components.chipSelect.text,
      backgroundColor: theme.components.chipSelect.background,
      borderColor: theme.components.chipSelect.border,
      borderWidth: 1,
      outlineColor: theme.components.chipSelect.border,
      outlineWidth: 1,
      outlineStyle: hovered ? 'solid' : 'none',
      boxShadow: focused ? theme.colors.focus : 'none',
      variants: {
        size: {
          sm: {
            paddingHorizontal: Spacing['3xs'],
            height: 24,
          },
          md: {
            paddingHorizontal: Spacing['3xs'],
            height: 30,
          },
          lg: {
            paddingHorizontal: Spacing.xxs,
            height: 38,
          },
        },
        selected: {
          true: {
            backgroundColor: theme.components.chipSelect.selected.background[color],
          },
        },
        disabled: {
          true: {
            opacity: 0.3,
          },
        },
      },
    }
  },
  avatar: {
    variants: {
      size: {
        sm: {
          width: 18,
          height: 18,
          marginLeft: -(Spacing['3xs'] - 2),
          marginVertical: 2,
        },
        md: {
          width: 24,
          height: 24,
          marginLeft: -(Spacing['3xs'] - 2),
          marginVertical: 2,
        },
        lg: {
          width: 32,
          height: 32,
          marginLeft: -(Spacing.xxs - 2),
        },
      },
    },
  },
  text: {
    fontWeight: '400',
    color: theme.components.chipSelect.text,
    variants: {
      //  Temporary explicit styles, until new font & Text component is built
      size: {
        sm: { fontSize: 13, lineHeight: 15.6, letterSpacing: -0.104 },
        md: { fontSize: 15, lineHeight: 21, letterSpacing: -0.12 },
        lg: { fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18 },
      },
    },
  },
}))
