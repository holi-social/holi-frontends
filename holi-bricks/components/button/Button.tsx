import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/accessibility'
import { TextLink } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import type React from 'react'
import { useCallback, useState } from 'react'
import { type GestureResponderEvent, Pressable, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader } from '@holi/icons/src/generated'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = AccessibilityProps & {
  label: string
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
  variant?: ButtonVariant
  disabled?: boolean
  size?: ButtonSize
  loading?: boolean
  transparent?: boolean
  selected?: boolean
  icon?: HoliIconType
  inline?: boolean
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'md',
  loading = false,
  transparent = false,
  selected = false,
  icon,
  inline = false,
  ...rest
}: ButtonProps) => {
  const [isProcessing, setProcessing] = useState(false)
  const { styles } = useStyles(stylesheet, {
    variant,
    size,
    selected,
    disabled,
  })

  const isSpinning = loading || isProcessing

  const handlePress = useCallback(
    async (event: React.SyntheticEvent | GestureResponderEvent) => {
      if (onPress && !isSpinning && !disabled) {
        setProcessing(true)
        try {
          await onPress(event)
        } finally {
          setProcessing(false)
        }
      }
    },
    [disabled, isSpinning, onPress]
  )

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: isSpinning || disabled,
        selected: selected,
      }}
      aria-disabled={isSpinning || disabled}
      aria-pressed={selected}
      onPress={handlePress}
      style={({ hovered, pressed }) =>
        !transparent ? [styles.button(!disabled && !!hovered, !disabled && !!pressed, inline)] : undefined
      }
      disabled={isSpinning || disabled}
      {...accessibilityProps(rest)}
    >
      <View style={styles.content}>
        <TextLink size={size === 'lg' ? 'md' : 'sm'} color={styles.text(disabled, selected, variant).color}>
          {label}
        </TextLink>
        {isSpinning && !disabled && (
          <View testID="spinner">
            <SpinningIconContainer spinning={loading}>
              <HoliIcon icon={Loader} size={16} color={styles.text(disabled, selected, variant).color} />
            </SpinningIconContainer>
          </View>
        )}
        {(!isSpinning || disabled) && icon && (
          <HoliIcon icon={icon} color={styles.text(disabled, selected, variant).color} />
        )}
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  button: (hovered: boolean, pressed: boolean, inline) => {
    return {
      borderRadius: 1000, // pill
      outlineWidth: pressed ? 3 : hovered ? 2 : 1,
      outlineStyle: 'solid',
      display: 'flex',
      width: inline ? 'auto' : '100%',
      variants: {
        variant: {
          primary: {
            backgroundColor: theme.components.button.primary.background,
            outlineColor: theme.components.button.primary.border,
          },
          secondary: {
            backgroundColor: theme.components.button.secondary.background,
            outlineColor: theme.components.button.secondary.border,
          },
          danger: {
            backgroundColor: theme.components.button.danger.background,
            outlineColor: theme.components.button.danger.border,
          },
        },
        size: {
          sm: {
            paddingHorizontal: Spacing.xxs,
            paddingVertical: Spacing['3xs'],
          },
          md: {
            paddingHorizontal: Spacing.xs,
            paddingVertical: Spacing.xxs,
          },
          lg: {
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.md,
          },
        },
        selected: {
          true: {
            backgroundColor: theme.components.button.selected.background,
            outlineColor: theme.components.button.selected.border,
          },
        },
        disabled: {
          true: {
            backgroundColor: theme.components.button.disabled.background,
            outlineColor: theme.components.button.disabled.border,
          },
        },
      },
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  text: (disabled: boolean, selected: boolean, variant: ButtonVariant) => {
    return {
      color: disabled
        ? theme.components.button.disabled.text
        : selected
          ? theme.components.button.selected.text
          : theme.components.button[variant].text,
    }
  },
}))
