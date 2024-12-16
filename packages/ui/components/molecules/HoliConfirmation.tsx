import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
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
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button, type ButtonVariant } from 'holi-bricks/components/button'

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
  const { theme } = useTheme()
  const styles = useMemo(
    () => getStyles(screenWidth, smallDeviceWidth, isSmallDevice, theme),
    [screenWidth, smallDeviceWidth, isSmallDevice, theme]
  )

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
      <View style={styles.modalContainer}>
        <Pressable onPress={onDismiss} style={styles.backdrop} testID={`${testID}-confirmation-backdrop`} />

        <View style={styles.modalView}>
          <View style={styles.topContent}>
            <View style={styles.titleContainer}>
              <HoliHeading level="3" size="m">
                {title}
              </HoliHeading>
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

            <HoliText style={styles.description} testID={`${testID}-confirmation-description`}>
              {description}
            </HoliText>
            <View style={styles.buttonContainer}>
              {(onSecondary || onDismiss) && (
                <View style={styles.button}>
                  <Button
                    variant="secondary"
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
      </View>
    </ModalBasic>
  )
}

export default HoliConfirmation

const getStyles = (screenWidth: number, smallDeviceWidth: number, isSmallDevice: boolean, theme: HoliTheme) =>
  StyleSheet.create({
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
      backgroundColor: theme.colors.backdropBackground,
      ...StyleSheet.absoluteFillObject,
    },
    modalView: {
      maxWidth: 460,
      margin: Spacing.md,
      alignSelf: 'center',
      backgroundColor: theme.colors.background10,
      borderWidth: 2,
      borderRadius: Spacing.md,
      borderColor: theme.colors.foreground30,
      shadowColor: theme.colors.foreground30,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 1,
      shadowRadius: 0,
      ...(isSmallDevice ? { minWidth: screenWidth * 0.9 } : { minWidth: smallDeviceWidth }),
    },
    description: {
      marginTop: 8,
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
  })
