import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { type LayoutProps, Spacing, layoutStyle } from 'holi-bricks/foundations'
import { TextLink } from 'holi-bricks/components/text'
import type React from 'react'
import { useCallback, useState } from 'react'
import { type GestureResponderEvent, Pressable, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { HoliLogoFilled, Loader, LogoApple, LogoFacebook, LogoGoogle } from '@holi/icons/src/generated'

import {
  buttonBaseStyle,
  buttonContentStyle,
  getButtonDisabledStyle,
  getButtonSelectedStyle,
  getButtonTextVariantStyle,
  getButtonVariantStyle,
} from './helpers'

export type SocialLoginButtonProvider = 'Google' | 'Facebook' | 'Apple' | 'Holi'

const iconsByProvider = {
  Google: LogoGoogle,
  Facebook: LogoFacebook,
  Apple: LogoApple,
  Holi: HoliLogoFilled,
}

export type SocialLoginButtonProps = AccessibilityProps &
  LayoutProps & {
    label: string
    provider: SocialLoginButtonProvider
    onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
    disabled?: boolean
    loading?: boolean
    selected?: boolean
    testID?: string
  }

export const SocialLoginButton = ({
  label,
  provider,
  onPress,
  disabled = false,
  loading = false,
  selected = false,
  testID,
  ...rest
}: SocialLoginButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isProcessing, setProcessing] = useState(false)
  const { styles } = useStyles(stylesheet, {
    selected,
    disabled,
  })

  const isSpinning = loading || isProcessing

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
      style={({ pressed }) => [styles.button(!disabled && isHovered, !disabled && !!pressed), layoutStyle(rest)]}
      disabled={isSpinning || disabled}
      testID={testID}
      {...accessibilityProps(rest)}
    >
      <View style={styles.content}>
        <HoliIcon
          icon={iconsByProvider[provider]}
          size={styles.icon.height}
          colorOverride={styles.text(disabled, selected).color}
        />
        <View style={styles.textContainer}>
          <TextLink size="md" colorOverride={styles.text(disabled, selected).color} role="presentation">
            {label}
          </TextLink>
        </View>
        {isSpinning && (
          <View testID="spinner">
            <SpinningIconContainer spinning={isSpinning}>
              <HoliIcon
                icon={Loader}
                size={styles.spinner.height}
                colorOverride={styles.text(disabled, selected).color}
              />
            </SpinningIconContainer>
          </View>
        )}
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  button: (hovered: boolean, pressed: boolean) => {
    return {
      ...buttonBaseStyle,
      width: '100%',
      alignSelf: 'auto',
      ...getButtonVariantStyle({ variant: 'secondary', theme, pressed, hovered }),
      paddingHorizontal: Spacing.md,
      variants: {
        selected: getButtonSelectedStyle(theme),
        disabled: getButtonDisabledStyle(theme),
      },
    }
  },
  content: {
    ...buttonContentStyle,
    gap: Spacing['3xs'],
  },
  textContainer: {
    height: Spacing.xxl,
    justifyContent: 'center',
  },
  text: (disabled: boolean, selected: boolean) =>
    getButtonTextVariantStyle({ variant: 'secondary', theme, disabled, selected }),
  icon: {
    height: Spacing.md,
  },
  spinner: {
    height: Spacing.xs,
  },
}))
