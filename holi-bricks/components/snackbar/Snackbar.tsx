import { Close } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { createStyleSheet } from 'holi-bricks/styles'
import { useStyles } from 'react-native-unistyles'
import type React from 'react'
import { Pressable, View } from 'react-native'
import { type LayoutProps, layoutStyle, Spacing } from 'holi-bricks/foundations'
import { ButtonIcon } from 'holi-bricks/components/button'
import { useCallback, useEffect, useRef, useState } from 'react'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'

type SnackbarProps = AccessibilityProps &
  LayoutProps & {
    label: string | React.ReactNode
    variant?: 'error' | 'warning' | 'success'
    icon?: HoliIconType
    actionLabel?: string
    onPress?: () => void
    showDismiss?: boolean
    persistent?: boolean
    duration?: 'short' | 'medium' | 'long'
    positionTowardsParent?: 'above' | 'below'
    show?: boolean
    onDismiss?: () => void
  }

export const Snackbar = ({
  label,
  variant = 'success',
  icon,
  actionLabel,
  onPress,
  showDismiss,
  persistent = false,
  duration = 'medium',
  positionTowardsParent: position = 'below',
  show = true,
  onDismiss,
  ...rest
}: SnackbarProps) => {
  const { styles } = useStyles(stylesheet)

  const iconColor = {
    error: 'danger' as const,
    warning: 'warning' as const,
    success: 'positive' as const,
  }[variant]

  const iconColorOverride = {
    error: styles.icon('redDefault').color,
    warning: styles.icon('orangeDefault').color,
    success: styles.icon('greenDefault').color,
  }[variant]

  const snackbarDuration = {
    short: 1500,
    medium: 3000,
    long: 5000,
  }[duration]

  const [visible, setVisible] = useState<boolean>(show)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const closeSnackbar = useCallback(() => {
    if (onDismiss) onDismiss()
    setVisible(false)
  }, [onDismiss])

  const startTimer = useCallback(() => {
    if (!persistent && visible) {
      if (timerRef.current) clearTimeout(timerRef.current) // Clear any existing timer before starting a new one
      timerRef.current = setTimeout(closeSnackbar, snackbarDuration) // start a new timer to close snackbar
    }
  }, [visible, closeSnackbar, snackbarDuration, persistent])

  const pauseTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  useEffect(() => {
    setVisible(show)
    if (show) {
      startTimer()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [show, startTimer])

  if (!visible) return null
  return (
    <Pressable
      style={[styles.snackbar(position), layoutStyle(rest)]}
      onHoverIn={pauseTimer} // dont close snackbar while hovering
      onHoverOut={startTimer} // reset timer to close snackbar
      {...accessibilityProps(rest)}
    >
      <Stack
        backgroundColor="selected"
        borderRadius="md"
        direction="row"
        justifyContent="space-between"
        padding="xxs"
        width={351}
        alignItems="center"
      >
        <Stack direction="row" gap="3xs" flexShrink={1} alignItems="center">
          {icon && <HoliIcon icon={icon} color={iconColor} colorOverride={iconColorOverride} />}
          <Text size="sm" color="selected">
            {label}
          </Text>
        </Stack>
        <Stack direction="row" gap="3xs" alignItems="center">
          {actionLabel && (
            <View style={{ maxWidth: Spacing['4xl'] }}>
              <TextLink size="sm" color="selected" onPress={onPress} numberOfLines={1}>
                {actionLabel}
              </TextLink>
            </View>
          )}
          {showDismiss && (
            <ButtonIcon
              icon={Close}
              onPress={closeSnackbar}
              label="close button"
              transparent
              color="selected"
              size="lg"
            />
          )}
        </Stack>
      </Stack>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  icon: (colorVariant: 'redDefault' | 'greenDefault' | 'orangeDefault') => {
    return {
      color: theme.colors.decorative[colorVariant],
    }
  },
  snackbar: (position) => ({
    position: 'absolute',
    top: position === 'above' ? -Spacing['4xl'] : 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: position === 'above' ? 0 : Spacing.xl,
    zIndex: 1000,
  }),
}))
