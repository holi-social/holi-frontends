import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { useState } from 'react'
import { type GestureResponderEvent, Pressable, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LogoGoogle, LogoFacebook, LogoApple } from '@holi/icons/src/generated'
import {
  buttonBaseStyle,
  buttonContentStyle,
  getButtonTextVarianStyle,
  getButtonVariantStyle,
} from 'holi-bricks/components/button/helpers'

type OAuthProvider = 'google' | 'facebook' | 'apple'

export type OAuthButtonProps = AccessibilityProps & {
  provider: OAuthProvider
  label: string
  onPress?: (event: GestureResponderEvent) => void
  disabled?: boolean
  loading?: boolean
  loadingLabel?: string
  selected?: boolean
  testID?: string
}

export const OAuthButton = ({ provider, label, onPress, disabled = false, testID, ...rest }: OAuthButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { styles } = useStyles(stylesheet)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: disabled,
      }}
      aria-disabled={disabled}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [styles.button(!disabled && isHovered, !disabled && !!pressed)]}
      disabled={disabled}
      testID={testID}
      {...accessibilityProps(rest)}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <HoliIcon
            icon={provider === 'google' ? LogoGoogle : provider === 'facebook' ? LogoFacebook : LogoApple}
            size={24}
            color={styles.text(disabled, false).color}
          />
        </View>
        <View style={styles.textContainer}>
          <Text size="lg" colorOverride={styles.text(disabled, false).color}>
            {label}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  button: (hovered: boolean, pressed: boolean) => ({
    ...buttonBaseStyle,
    width: '100%',
    ...getButtonVariantStyle({ variant: 'secondary', theme, pressed, hovered }),
    ...(pressed && {
      transform: [{ scale: 0.98 }],
    }),
  }),
  content: {
    ...buttonContentStyle,
    padding: Spacing['4xs'],
  },
  textContainer: {
    height: Spacing.xl,
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing['4xs'],
  },
  text: (disabled: boolean, selected: boolean) =>
    getButtonTextVarianStyle({ variant: 'secondary', theme, disabled, selected }),
}))

export default OAuthButton
