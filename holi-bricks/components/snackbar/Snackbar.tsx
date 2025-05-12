import { Close } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { createStyleSheet } from 'holi-bricks/styles'
import { useStyles } from 'react-native-unistyles'
import type React from 'react'
import { Pressable, View } from 'react-native'
import { Spacing } from 'holi-bricks/foundations'
import { ButtonIcon } from 'holi-bricks/components/button'
import { useCallback, useEffect, useState } from 'react'

interface SnackbarProps {
  label: string
  variant?: 'error' | 'warning' | 'success'
  icon?: HoliIconType
  actionLabel?: string
  onPress?: () => void
  showDismiss?: boolean
  persistent?: boolean
  duration?: 'short' | 'medium' | 'long'
}

export const Snackbar = ({
  label,
  variant,
  icon,
  actionLabel,
  onPress,
  showDismiss,
  persistent = false,
  duration = 'medium',
}: SnackbarProps) => {
  const { styles } = useStyles(stylesheet)
  const iconColor = variant === 'error' ? 'danger' : variant === 'warning' ? 'warning' : 'positive'
  const iconColorOverride =
    variant === 'error'
      ? styles.icon('redDefault').color
      : variant === 'warning'
        ? styles.icon('orangeDefault').color
        : styles.icon('greenDefault').color

  const [snackbarClosed, setSnackbarClosed] = useState<boolean>(false)
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const snackbarDuration = duration === 'long' ? 5000 : duration === 'medium' ? 3000 : 1500

  const closeSnackbar = useCallback(() => {
    setSnackbarClosed(true)
  }, [])

  useEffect(() => {
    if (persistent) return
    const newtimer = setTimeout(closeSnackbar, snackbarDuration)
    setTimer(newtimer)

    return () => {
      clearTimeout(newtimer) // Clear the timer when the component unmounts or when persistent changes
    }
  }, [closeSnackbar, snackbarDuration, persistent])

  const resumeTimer = () => {
    if (!persistent) {
      clearTimeout(timer) // Clear any existing timer before starting a new one
      const newTimer = setTimeout(closeSnackbar, snackbarDuration) // start a new timer to close snackbar
      setTimer(newTimer) // Update the timer
    }
  }

  return (
    !snackbarClosed && (
      <Pressable
        style={styles.snackbar}
        onHoverIn={() => clearTimeout(timer)} // dont close snackbar while hovering
        onHoverOut={resumeTimer} // reset timer to close snackbar
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
  )
}

const stylesheet = createStyleSheet((theme) => ({
  icon: (colorVariant: 'redDefault' | 'greenDefault' | 'orangeDefault') => {
    return {
      color: theme.colors.decorative[colorVariant],
    }
  },
  snackbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: Spacing.xl,
    zIndex: 1000,
  },
}))
