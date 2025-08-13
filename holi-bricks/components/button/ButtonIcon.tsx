import { StyleSheet } from 'react-native-unistyles'
import type React from 'react'
import { useCallback, useState } from 'react'
import { type GestureResponderEvent, Pressable, View } from 'react-native'

import { Spacing, layoutStyle, IconSize } from 'holi-bricks/foundations'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader } from '@holi/icons/src/generated'
import type { ButtonProps } from 'holi-bricks/components/button'
import {
  buttonBaseStyle,
  buttonContentStyle,
  type ButtonVariant,
  getButtonDisabledStyle,
  getButtonSelectedStyle,
  getButtonTextVariantStyle,
  getButtonVariantStyle,
} from './helpers'
import type { FillColors } from 'holi-bricks/foundations/colors/themes/types'
import { accessibilityProps } from 'holi-bricks/foundations/accessibility'

export interface ButtonIconProps extends Omit<ButtonProps, 'inline' | 'loadingLabel' | 'variant'> {
  icon: HoliIconType
  variant?: Extract<ButtonVariant, 'primary' | 'secondary' | 'tertiary'>
  color?: FillColors
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
  color,
  ...rest
}: ButtonIconProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isProcessing, setProcessing] = useState(false)
  styles.useVariants({
    iconVariant,
    size,
    selected,
    disabled,
  })

  const isSpinning = loading || isProcessing
  const isDisabled = disabled || isSpinning

  const handlePress = useCallback(
    async (event: GestureResponderEvent) => {
      if (!onPress) return

      setProcessing(true)
      try {
        await onPress(event)
      } finally {
        setProcessing(false)
      }
    },
    [onPress]
  )

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: isDisabled,
        selected,
      }}
      aria-disabled={isDisabled}
      aria-pressed={selected}
      onPress={handlePress}
      onHoverIn={() => !disabled && setIsHovered(true)}
      onHoverOut={() => !disabled && setIsHovered(false)}
      style={({ pressed }) => [!transparent && styles.button(isHovered, pressed), layoutStyle(rest)]}
      disabled={isDisabled}
      testID={testID}
      {...accessibilityProps(rest)}
    >
      <View style={!transparent && styles.content}>
        {isSpinning ? (
          <View testID={`${testID}-spinner`}>
            <SpinningIconContainer spinning={isSpinning}>
              <HoliIcon
                icon={Loader}
                size={IconSize[size]}
                color={color}
                colorOverride={!color ? styles.text(disabled, selected, iconVariant).color : undefined}
              />
            </SpinningIconContainer>
          </View>
        ) : (
          <HoliIcon
            icon={icon}
            size={IconSize[size]}
            color={color}
            colorOverride={!color ? styles.text(disabled, selected, iconVariant).color : undefined}
          />
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  button: (hovered: boolean, pressed: boolean) => {
    return {
      ...buttonBaseStyle,
      variants: {
        iconVariant: {
          primary: getButtonVariantStyle({ variant: 'primary', theme, pressed, hovered }),
          secondary: getButtonVariantStyle({ variant: 'secondary', theme, pressed, hovered }),
          tertiary: {
            ...getButtonVariantStyle({ variant: 'tertiary', theme, pressed, hovered }),
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
        selected: getButtonSelectedStyle(theme),
        disabled: getButtonDisabledStyle(theme),
      },
    }
  },
  content: buttonContentStyle,
  text: (disabled: boolean, selected: boolean, variant: ButtonVariant) =>
    getButtonTextVariantStyle({ variant, theme, disabled, selected }),
}))
