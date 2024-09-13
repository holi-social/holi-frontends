import React, { ReactNode } from 'react'
import { GestureResponderEvent, Platform, Pressable, PressableProps, ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { Color } from '@holi/ui/no-name/foundations/colors/primitives'

export type ChipColor = Color | 'white'
export type Size = 'md' | 'lg'

export type ChipProps = PressableProps & {
  onPress: (event: GestureResponderEvent) => void
  children?: ReactNode
  selected?: boolean
  disabled?: boolean
  color?: ChipColor
  size?: Size
  iconLeading?: HoliIconType
  iconTrailing?: HoliIconType
}

const Chip = ({
  onPress,
  children,
  selected = false,
  disabled = false,
  color = 'mono',
  size = 'md',
  iconLeading,
  iconTrailing,
}: ChipProps) => {
  const { styles } = useStyles(stylesheet, { size, selected, disabled })

  return (
    <Pressable
      role="switch"
      aria-checked={selected}
      disabled={disabled}
      onPress={(e) => onPress?.(e)}
      style={({ hovered, focused }) => [styles.chip(!!hovered, !disabled && !!focused, color)]}
    >
      <>
        {iconLeading && <HoliIcon icon={iconLeading} size={18} color={styles.text.color} />}
        {children && (
          <HoliText selectable={false} style={styles.text}>
            {children}
          </HoliText>
        )}
        {iconTrailing && <HoliIcon icon={iconTrailing} size={18} color={styles.text.color} />}
      </>
    </Pressable>
  )
}

export default Chip

const stylesheet = createStyleSheet((theme) => ({
  chip: (hovered: boolean, focused: boolean, color: ChipColor) => {
    return {
      display: 'flex',
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
      color: theme.components.chip.text,
      backgroundColor: theme.components.chip.background[color],
      borderColor: theme.components.chip.border,
      borderWidth: 1,
      borderRadius: 50,
      outlineColor: theme.components.chip.border,
      outlineWidth: 1,
      outlineStyle: hovered ? 'solid' : 'none',
      boxShadow: focused ? theme.colors.focus : 'none',
      maxWidth: '100%',
      overflow: 'hidden',
      ...Platform.select({
        web: {
          display: 'inline-flex' as ViewStyle['display'],
        },
      }),
      variants: {
        size: {
          md: {
            paddingHorizontal: 8,
          },
          lg: {
            paddingHorizontal: 10,
          },
        },
        selected: {
          true: {
            color: theme.components.chip.selected.text,
            borderColor: theme.components.chip.selected.border,
            backgroundColor: theme.components.chip.selected.background,
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
  text: {
    fontWeight: '400',
    color: theme.components.chip.text,
    variants: {
      //  Temporary explicit styles, until new font & Text component is built
      size: {
        md: { fontSize: 15, lineHeight: 21, letterSpacing: -0.12 },
        lg: { fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18 },
      },
      selected: {
        true: {
          color: theme.components.chip.selected.text,
        },
      },
    },
  },
}))
