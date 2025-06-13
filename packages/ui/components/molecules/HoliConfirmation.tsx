import type React from 'react'
import { useCallback, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type AccessibilityProps,
  type ModalProps,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close } from '@holi/icons/src/generated'
import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Button, type ButtonVariant } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Stack } from 'holi-bricks/components/stack'

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
  const smallDeviceWidth = dimensions.breakpointXs + 50
  const isSmallDevice = screenWidth <= smallDeviceWidth
  const { styles } = useStyles(stylesheet)

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

        <View style={styles.modalView(isSmallDevice, screenWidth, smallDeviceWidth)}>
          <View style={styles.topContent}>
            <View style={styles.titleContainer}>
              <Text headingLevel="3" size="lg">
                {title}
              </Text>
              <TouchableOpacity
                accessibilityLabel={t('confirmation.dismiss')}
                accessibilityRole="button"
                testID={`${testID}-confirmation-dismiss`}
                onPress={() => {
                  if (onDismiss) onDismiss()
                }}
              >
                <HoliIcon size={24} icon={Close} />
              </TouchableOpacity>
            </View>
            <View style={styles.description} testID={`${testID}-confirmation-description`}>
              <Text size="md" color="support">
                {description}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              {(onSecondary || onDismiss) && (
                <View style={styles.button}>
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
                </View>
              )}
              {onPrimary && (
                <View style={styles.button}>
                  <Button
                    label={primaryText || t('confirmation.confirm')}
                    onPress={() => {
                      onPrimary()
                    }}
                    variant={primaryButtonVariant}
                    testID={`${testID}-confirmation-primary`}
                  />
                </View>
              )}
            </View>
          </View>
          {footerComponent}
        </View>
      </Stack>
    </ModalBasic>
  )
}

export default HoliConfirmation

const stylesheet = createStyleSheet((theme) => {
  return {
    topContent: {
      padding: Spacing.md,
    },
    modalContainer: {
      justifyContent: 'center',
      flex: 1,
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    backdrop: {
      opacity: 0.4,
      backgroundColor: theme.colors.bg.selected,
      ...StyleSheet.absoluteFillObject,
    },
    modalView: (isSmallDevice: boolean, screenWidth: number, smallDeviceWidth: number) => ({
      maxWidth: 460,
      margin: Spacing.md,
      alignSelf: 'center',
      backgroundColor: theme.colors.bg.support,
      borderWidth: 1,
      borderRadius: Spacing.md,
      borderColor: theme.colors.border.support,
      minWidth: isSmallDevice ? screenWidth * 0.9 : smallDeviceWidth,
    }),
    description: {
      marginTop: Spacing['4xs'],
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: Spacing.md,
      gap: Spacing.xxs,
    },
    button: {
      flexGrow: 1,
    },
  }
})
