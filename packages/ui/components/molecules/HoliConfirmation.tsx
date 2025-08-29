import type React from 'react'
import { useCallback, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type AccessibilityProps,
  type ModalProps,
  Platform,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close } from '@holi/icons/src/generated'
import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'
import { Button, type ButtonVariant } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'

import { Stack } from 'holi-bricks/components/stack'
import { breakpoints } from 'holi-bricks/foundations'

export interface UseConfirmation {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  props: UseConfirmationProps
}

export interface UseConfirmationProps {
  show: boolean
  onPrimary: () => void
  onDismiss: () => void
  onSecondary?: () => void
}

export interface HoliConfirmationProps extends ModalProps {
  show: boolean
  label: string
  title: string
  description: string
  subline?: string | React.ReactNode
  primaryButtonVariant?: ButtonVariant
  secondaryButtonVariant?: ButtonVariant
  onPrimary?: () => boolean | void
  onDismiss?: () => boolean | void
  onSecondary?: () => boolean | void
  primaryText?: string
  secondaryText?: string
  testID?: string
  footerComponent?: ReactNode
}

export const useConfirmationState = ({
  show = false,
  onSecondary,
  onDismiss,
  onPrimary,
}: Partial<Pick<HoliConfirmationProps, 'show' | 'onPrimary' | 'onDismiss' | 'onSecondary'>> = {}) => {
  const [visible, setVisible] = useState(show)

  const primaryHandler = useCallback(() => {
    const primaryPropagation = onPrimary?.()
    if (primaryPropagation !== false) {
      setVisible(false)
    }
  }, [onPrimary])

  const dismissHandler = useCallback(() => {
    const dismissPropagation = onDismiss?.()
    if (dismissPropagation !== false) {
      setVisible(false)
    }
  }, [onDismiss])

  const secondaryHandler = useCallback(() => {
    const secondaryPropagation = onSecondary?.()
    if (secondaryPropagation !== false) {
      setVisible(false)
    }
  }, [onSecondary])

  return {
    show: visible,
    setShow: setVisible,
    props: {
      show: visible,
      onPrimary: primaryHandler,
      onDismiss: dismissHandler,
      onSecondary: secondaryHandler,
    },
  }
}

const HoliConfirmation: React.FC<HoliConfirmationProps> = ({
  show = false,
  label,
  title,
  description,
  subline,
  primaryButtonVariant = 'primary',
  secondaryButtonVariant = 'secondary',
  onPrimary,
  onDismiss,
  onSecondary,
  primaryText,
  secondaryText,
  footerComponent = null,
  testID = 'holi',
}) => {
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()
  const smallDeviceWidth = breakpoints.xs + 50
  const isSmallDevice = screenWidth <= smallDeviceWidth

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { 'aria-modal': true } : {}),
    'aria-label': label,
  }

  return (
    <ModalBasic
      label=""
      {...accessibilityProps}
      shown={show}
      transparent
      animationType="fade"
      testID={`${testID}-confirmation-dialog`}
    >
      <Stack justifyContent="center" flex={1}>
        <Pressable onPress={onDismiss} style={styles.backdrop} testID={`${testID}-confirmation-backdrop`} />
        {/* maxWidth: 460 */}
        <Stack
          maxWidth="sm"
          margin="md"
          alignSelf="center"
          backgroundColor="support"
          borderWidth="sm"
          borderRadius="xl"
          borderColor="support"
          minWidth={isSmallDevice ? screenWidth * 0.9 : smallDeviceWidth}
        >
          <Stack padding="md" gap="xs">
            <Stack gap="3xs">
              <Stack alignItems="center" direction="row" justifyContent="space-between">
                <Text headingLevel="3" size="xxl">
                  {title}
                </Text>
                <TouchableOpacity
                  accessibilityLabel={t('confirmation.dismiss')}
                  accessibilityRole="button"
                  testID={`${testID}-confirmation-dismiss`}
                  onPress={onDismiss}
                >
                  <HoliIcon size={24} icon={Close} />
                </TouchableOpacity>
              </Stack>
              <Stack testID={`${testID}-confirmation-description`}>
                <Text size="md">{description}</Text>
              </Stack>
              {!!subline && (
                <Stack testID={`${testID}-confirmation-description-part-two`}>
                  <Text size="md">{subline}</Text>
                </Stack>
              )}
            </Stack>
            <Stack direction="row" wrap="wrap" gap="xxs">
              {(onSecondary || onDismiss) && (
                <Stack flex={1}>
                  <Button
                    variant={secondaryButtonVariant}
                    label={secondaryText || t('confirmation.dismiss')}
                    onPress={() => {
                      if (onSecondary) {
                        onSecondary()
                      } else if (onDismiss) {
                        onDismiss()
                      }
                    }}
                    testID={`${testID}-confirmation-secondary`}
                  />
                </Stack>
              )}
              {onPrimary && (
                <Stack flex={1}>
                  <Button
                    label={primaryText || t('confirmation.confirm')}
                    onPress={() => {
                      onPrimary()
                    }}
                    variant={primaryButtonVariant}
                    testID={`${testID}-confirmation-primary`}
                  />
                </Stack>
              )}
            </Stack>
          </Stack>
          {footerComponent}
        </Stack>
      </Stack>
    </ModalBasic>
  )
}

export default HoliConfirmation

const styles = StyleSheet.create((theme) => {
  return {
    backdrop: {
      opacity: 0.4,
      backgroundColor: theme.colors.bg.selected,
      ...StyleSheet.absoluteFillObject,
    },
  }
})
