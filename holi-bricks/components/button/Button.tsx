import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import { TextLink } from 'holi-bricks/components/text'
import type React from 'react'
import { useCallback, useState } from 'react'
import { type GestureResponderEvent, Pressable, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader } from '@holi/icons/src/generated'

import {
  buttonBaseStyle,
  buttonContentStyle,
  type ButtonVariant as ButtonVariantBaseType,
  getButtonDisabledStyle,
  getButtonSelectedStyle,
  getButtonTextVariantStyle,
  getButtonVariantStyle,
} from './helpers'

export type ButtonVariant = Extract<ButtonVariantBaseType, 'primary' | 'secondary' | 'danger'>

export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = AccessibilityProps & {
  label: string
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
  variant?: Extract<ButtonVariant, 'primary' | 'secondary' | 'danger'>
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
    async (event: GestureResponderEvent) => {
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
        <View style={styles.textContainer(size)}>
          <TextLink
            size={size === 'lg' ? 'md' : 'sm'}
            colorOverride={styles.text(disabled, selected, variant).color}
            role="presentation"
          >
            {labelToShow}
          </TextLink>
        </View>
        {isSpinning && (
          <View testID="spinner">
            <SpinningIconContainer spinning={isSpinning}>
              <HoliIcon
                icon={Loader}
                size={styles.icon.height}
                colorOverride={styles.text(disabled, selected, variant).color}
              />
            </SpinningIconContainer>
          </View>
        )}
        {!isSpinning && icon && (
          <HoliIcon
            icon={icon}
            size={styles.icon.height}
            colorOverride={styles.text(disabled, selected, variant).color}
          />
        )}
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  button: (hovered: boolean, pressed: boolean, inline: boolean) => {
    return {
      ...buttonBaseStyle,
      width: inline ? 'auto' : '100%',
      alignSelf: inline ? 'center' : 'auto',
      variants: {
        variant: {
          primary: getButtonVariantStyle({ variant: 'primary', theme, pressed, hovered }),
          secondary: getButtonVariantStyle({ variant: 'secondary', theme, pressed, hovered }),
          danger: getButtonVariantStyle({ variant: 'danger', theme, pressed, hovered }),
        },
        size: {
          sm: {
            paddingHorizontal: Spacing.xxs,
          },
          md: {
            paddingHorizontal: Spacing.xs,
          },
          lg: {
            paddingHorizontal: Spacing.md,
          },
        },
        selected: getButtonSelectedStyle(theme),
        disabled: getButtonDisabledStyle(theme),
      },
    }
  },
  content: buttonContentStyle,
  textContainer: (size: ButtonSize) => {
    const heightBySize = {
      sm: Spacing.lg,
      md: Spacing.xl,
      lg: Spacing.xxl,
    }
    return {
      height: heightBySize[size],
      justifyContent: 'center',
    }
  },
  text: (disabled: boolean, selected: boolean, variant: ButtonVariant) =>
    getButtonTextVariantStyle({ variant, theme, disabled, selected }),
  icon: {
    height: Spacing.xs,
  },
}))
