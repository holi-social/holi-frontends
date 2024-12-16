import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/accessibility'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import { Text } from 'holi-bricks/components/text'
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
  loadingLabel?: string
  transparent?: boolean
  selected?: boolean
  icon?: HoliIconType
  inline?: boolean
  testID?: string
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'md',
  loading = false,
  loadingLabel,
  transparent = false,
  selected = false,
  icon,
  inline = false,
  testID,
  ...rest
}: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isProcessing, setProcessing] = useState(false)
  const { styles } = useStyles(stylesheet, {
    variant,
    size,
    selected,
    disabled,
  })

  const isSpinning = loading || isProcessing
  const labelToShow = isSpinning && loadingLabel ? loadingLabel : label

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
      accessibilityLabel={labelToShow}
      accessibilityState={{
        disabled: isSpinning || disabled,
        selected: selected,
      }}
      aria-disabled={isSpinning || disabled}
      aria-pressed={selected}
      onPress={handlePress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) =>
        !transparent ? [styles.button(!disabled && isHovered, !disabled && !!pressed, inline)] : undefined
      }
      disabled={isSpinning || disabled}
      testID={testID}
      {...accessibilityProps(rest)}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text size={size === 'lg' ? 'md' : 'sm'} color={styles.text(disabled, selected, variant).color}>
            {labelToShow}
          </Text>
        </View>
        {isSpinning && (
          <View testID="spinner">
            <SpinningIconContainer spinning={isSpinning}>
              <HoliIcon icon={Loader} size={16} color={styles.text(disabled, selected, variant).color} />
            </SpinningIconContainer>
          </View>
        )}
        {!isSpinning && icon && (
          <HoliIcon icon={icon} size={16} color={styles.text(disabled, selected, variant).color} />
        )}
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  button: (hovered: boolean, pressed: boolean, inline: boolean) => {
    return {
      borderRadius: 1000, // pill
      borderStyle: 'solid',
      borderWidth: 1,
      display: 'flex',
      width: inline ? 'auto' : '100%',
      variants: {
        variant: {
          primary: {
            backgroundColor: theme.components.button.primary.background,
            borderColor: theme.components.button.primary.border,
            boxShadow: `0 0 0 ${pressed ? '2px' : hovered ? '1px' : '0px'} ${theme.components.button.primary.border}`,
          },
          secondary: {
            backgroundColor: theme.components.button.secondary.background,
            borderColor: theme.components.button.secondary.border,
            boxShadow: `0 0 0 ${pressed ? '2px' : hovered ? '1px' : '0px'} ${theme.components.button.secondary.border}`,
          },
          danger: {
            backgroundColor: theme.components.button.danger.background,
            borderColor: theme.components.button.danger.border,
            boxShadow: `0 0 0 ${pressed ? '2px' : hovered ? '1px' : '0px'} ${theme.components.button.danger.border}`,
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
            borderColor: theme.components.button.selected.border,
          },
        },
        disabled: {
          true: {
            backgroundColor: theme.components.button.disabled.background,
            borderColor: theme.components.button.disabled.border,
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
  textContainer: {
    height: Spacing.xs,
    justifyContent: 'center',
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
