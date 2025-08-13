import { useCallback, useEffect, useRef } from 'react'
import type React from 'react'
import { Platform, Pressable, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Close } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { type LayoutProps, layoutStyle, Spacing } from 'holi-bricks/foundations'
import { ButtonIcon } from 'holi-bricks/components/button'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'

const isWeb = Platform.OS === 'web'

export type SnackbarProps = AccessibilityProps &
  LayoutProps & {
    label: string | React.ReactNode
    variant?: 'error' | 'warning' | 'success'
    icon?: HoliIconType
    actionLabel?: string
    onPress?: () => void
    dismissible?: boolean
    persistent?: boolean
    duration?: 'short' | 'medium' | 'long'
    visible?: boolean
    onDismiss?: () => void
    offset?: number
  }

export const Snackbar = ({
  label,
  variant = 'success',
  icon,
  actionLabel,
  onPress,
  dismissible,
  persistent = false,
  duration = 'medium',
  visible = true,
  onDismiss = () => {},
  offset = 0,
  ...rest
}: SnackbarProps) => {
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

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = useCallback(() => {
    if (!persistent && visible) {
      if (timerRef.current) clearTimeout(timerRef.current) // Clear any existing timer before starting a new one
      timerRef.current = setTimeout(onDismiss, snackbarDuration) // start a new timer to close snackbar
    }
  }, [visible, onDismiss, snackbarDuration, persistent])

  const pauseTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  useEffect(() => {
    if (visible) {
      startTimer()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, startTimer])

  if (!visible) return null

  return (
    <Pressable
      style={[styles.snackbar(offset), layoutStyle(rest), { position: isWeb ? 'fixed' : 'absolute' }]}
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
          <Stack flexShrink={1}>
            <Text size="sm" color="selected">
              {label}
            </Text>
          </Stack>
        </Stack>

        <Stack direction="row" gap="3xs" alignItems="center">
          {actionLabel && (
            <View style={{ maxWidth: Spacing['4xl'] }}>
              <TextLink size="sm" color="selected" onPress={onPress} numberOfLines={1}>
                {actionLabel}
              </TextLink>
            </View>
          )}

          {dismissible && (
            <ButtonIcon icon={Close} onPress={onDismiss} label="close button" transparent color="selected" size="lg" />
          )}
        </Stack>
      </Stack>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  icon: (colorVariant: 'redDefault' | 'greenDefault' | 'orangeDefault') => {
    return {
      color: theme.colors.decorative[colorVariant],
    }
  },
  snackbar: (offset: number) => ({
    bottom: offset,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  }),
}))
