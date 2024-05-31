import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface SpaceFormScreenLayoutProps {
  title?: string
  description?: string
  onSave: () => Promise<unknown>
  toggleConfirmationModal: (showConfirmation: boolean) => void
  showConfirmationModal: boolean
  saveButtonDisabled: boolean
  children: React.ReactNode
}

const SpaceFormScreenLayout: React.FC<SpaceFormScreenLayoutProps> = ({
  title,
  description,
  toggleConfirmationModal,
  onSave,
  saveButtonDisabled,
  showConfirmationModal,
  children,
}) => {
  const { height: deviceHeight } = useWindowDimensions()
  const { navigateBack } = useRouting()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')
  const { theme } = useTheme()
  const [keyboardIsOpening, setKeyboardIsOpening] = useState(false)
  const footerButtonMarginBottom = keyboardIsOpening ? 16 : 40
  const styles = useMemo(
    () => getStyles(theme, keyboardIsOpening, footerButtonMarginBottom),
    [theme, keyboardIsOpening, footerButtonMarginBottom]
  )
  const hideFooter = Platform.OS === 'android' && keyboardIsOpening

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardIsOpening(true)
    })

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardIsOpening(false)
    })

    return () => {
      keyboardWillShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return (
    <SpaceTermContextProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.pageView}
        keyboardVerticalOffset={0}
      >
        <HoliKeyboardSaveView
          style={styles.keyboardSaveView}
          initialOffsetTop={Platform.OS === 'web' ? dimensions.bottomBarHeight : 0}
        >
          <ScrollHeaderLayout.Default
            style={styles.defaultLayout}
            contentStyle={styles.contentStyle}
            headerOverlap
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[
                mixins.container,
                styles.container,
                { minHeight: deviceHeight, paddingTop: dimensions.topBarHeight + 40 },
              ]}
            >
              {!!title && (
                <HoliHeading level="1" size="m">
                  {title}
                </HoliHeading>
              )}
              {!!description && <HoliText style={styles.description}>{description}</HoliText>}
              {children}
            </View>
          </ScrollHeaderLayout.Default>

          {/* Footer */}
          {!hideFooter && (
            <View style={styles.footerContainer}>
              <View style={[mixins.container, styles.footer]}>
                <HoliButton
                  label={t('global.dismiss')}
                  type="secondary"
                  inline
                  style={styles.footerButton}
                  onPress={() => toggleConfirmationModal(true)}
                >
                  {t('global.dismiss')}
                </HoliButton>
                <HoliButtonLoading
                  disabled={saveButtonDisabled}
                  label={t('global.save')}
                  onPress={onSave}
                  testID="form-modal-save-btn"
                  style={styles.footerButton}
                />
              </View>
            </View>
          )}

          <HoliConfirmation
            show={showConfirmationModal}
            label={exitConfirmationTitle}
            title={exitConfirmationTitle}
            description={t('global.leavePage.confirmation.description')}
            onDismiss={() => toggleConfirmationModal(false)}
            dismissText={t('global.leavePage.confirmation.dismiss')}
            confirmText={t('global.leavePage.confirmation.confirm')}
            testID="form-modal-exit-confirmation"
            onConfirm={() => {
              toggleConfirmationModal(false)
              navigateBack()
            }}
          />
        </HoliKeyboardSaveView>
      </KeyboardAvoidingView>
    </SpaceTermContextProvider>
  )
}

export default SpaceFormScreenLayout

const getStyles = (theme: HoliTheme, keyboardIsOpening: boolean, footerButtonMarginBottom: number) =>
  StyleSheet.create({
    defaultLayout: {
      backgroundColor: theme.colors.background20,
      paddingTop: 16,
    },
    contentStyle: {
      paddingBottom: 0,
    },
    container: {
      flex: 1,
      paddingBottom: 132,
      ...Platform.select({
        native: {
          maxWidth: '100%',
        },
      }),
    },
    description: {
      marginBottom: 32,
      marginTop: 16,
      color: theme.colors.foreground20,
    },
    footerContainer: {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      paddingVertical: footerButtonMarginBottom,
      backgroundColor: keyboardIsOpening ? theme.colors.background10 : 'transparent',
      ...Platform.select({
        web: {
          marginBottom: 40,
        },
      }),
      ...(keyboardIsOpening && {
        borderTopWidth: 2,
        borderTopColor: theme.colors.background30,
      }),
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      ...Platform.select({
        web: {
          alignSelf: 'center',
          position: 'fixed',
        },
      }),
    },
    footerButton: {
      flex: 1,
    },
    pageView: {
      height: '100%', // prevents double scrollbars
      overflow: 'hidden',
      ...Platform.select({
        android: {
          paddingBottom: 0,
        },
      }),
    },
    keyboardSaveView: {
      position: 'relative',
      ...Platform.select({
        android: {
          minHeight: '100%',
        },
      }),
    },
  })
