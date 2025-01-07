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
import type { ButtonProps } from 'holi-bricks/components/button'

export type ButtonIconVariant = 'primary' | 'secondary' | 'tertiary'

export interface ButtonIconProps extends Omit<ButtonProps, 'inline' | 'loadingLabel' | 'variant'> {
  icon: HoliIconType
  variant?: ButtonIconVariant
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  label,
  onPress,
  variant: iconVariant = 'primary',
  disabled = false,
  size = 'md',
  loading = false,
  transparent = false,
  selected = false,
  icon,
  testID,
}: ButtonIconProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isProcessing, setProcessing] = useState(false)
  const { styles } = useStyles(stylesheet, {
    iconVariant,
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
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) =>
        !transparent ? [styles.button(!disabled && isHovered, !disabled && !!pressed)] : undefined
      }
      disabled={isSpinning || disabled}
      testID={testID}
    >
      <View style={styles.content}>
        {isSpinning && (
          <View testID="spinner">
            <SpinningIconContainer spinning={isSpinning}>
              <HoliIcon
                icon={Loader}
                size={size === 'lg' ? 24 : size === 'md' ? 20 : 16}
                color={styles.text(disabled, selected, iconVariant).color}
              />
            </SpinningIconContainer>
          </View>
        )}
        {!isSpinning && (
          <HoliIcon
            icon={icon}
            size={size === 'lg' ? 24 : size === 'md' ? 20 : 16}
            color={styles.text(disabled, selected, iconVariant).color}
          />
        )}
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  button: (hovered: boolean, pressed: boolean) => {
    return {
      borderRadius: 1000, // pill
      borderStyle: 'solid',
      borderWidth: 1,
      display: 'flex',
      variants: {
        iconVariant: {
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
          tertiary: {
            backgroundColor: theme.components.button.tertiary.background,
            borderColor: theme.components.button.tertiary.border,
            boxShadow: `0 0 0 ${pressed ? '2px' : hovered ? '1px' : '0px'} ${theme.components.button.tertiary.border}`,
            borderWidth: hovered || pressed ? 1 : 0,
          },
        },
        size: {
          sm: {
            padding: Spacing['3xs'],
            width: Spacing['lg'],
            height: Spacing['lg'],
          },
          md: {
            padding: 10,
            width: Spacing['xl'],
            height: Spacing['xl'],
          },
          lg: {
            padding: Spacing.xxs,
            width: Spacing['xxl'],
            height: Spacing['xxl'],
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
  text: (disabled: boolean, selected: boolean, variant: ButtonIconVariant) => {
    return {
      color: disabled
        ? theme.components.button.disabled.text
        : selected
          ? theme.components.button.selected.text
          : theme.components.button[variant].text,
    }
  },
}))
