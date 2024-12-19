import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  useWindowDimensions,
} from 'react-native'

import { ArrowLeft } from '@holi/icons/src/generated'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useKeyboard } from '@holi/ui/helper'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Button, ButtonIcon } from 'holi-bricks/components/button'

export interface FormWrapperProps extends ScrollViewProps {
  renderProp: (scrollToPropsFor: ReturnType<typeof useScrollToInputOnFocus>) => React.ReactNode
  onSave: () => Promise<unknown>
  onBack?: () => void
  onCancel?: () => void
  backButtonLabel?: string
  scrollToInput?: boolean
  initialOffsetTop?: number
  saveButtonDisabled?: boolean
  saveButtonLoading?: boolean
  showBackButton?: boolean
  showCancelButton?: boolean
  isModal?: boolean
  buttonLabel?: string
  showBottomBar?: boolean
  behavior?: 'position' | 'height' | 'padding'
  bottomBarStyle?: StyleProp<ViewStyle>
}

const SUBMIT_BUTTON_CONTAINER_HEIGHT = 64
const SMALL_DEVICE_HEIGHT = 600

const FormWrapper = React.forwardRef<KeyboardAvoidingView, FormWrapperProps>(
  (
    {
      renderProp,
      onSave,
      onBack,
      onCancel,
      backButtonLabel,
      initialOffsetTop,
      saveButtonDisabled,
      saveButtonLoading = false,
      showBackButton,
      showCancelButton,
      isModal = false,
      buttonLabel,
      showBottomBar = false,
      scrollToInput = true,
      testID = 'form-wrapper',
      behavior,
      bottomBarStyle,
      ...scrollViewProps
    }: FormWrapperProps,
    ref
  ) => {
    const { theme } = useTheme()
    const [maxViewPortHeight, setMaxViewPortHeight] = useState(0)
    const [scrollContentHeight, setScrollContentHeight] = useState(0)
    const scrollViewRef = useRef<ScrollView>(null)
    const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)
    const mixins = useStyleMixins()
    const { height: screenHeight } = useWindowDimensions()
    const { keyboardHeight } = useKeyboard()
    const { t } = useTranslation()

    const onHeightChange = useCallback((newContainerHeight: number) => {
      const newScrollViewHeight = newContainerHeight - SUBMIT_BUTTON_CONTAINER_HEIGHT
      setMaxViewPortHeight(newScrollViewHeight)
    }, [])

    /**
     * The view should:
     * - scroll input field into viewport (with open keyboard)
     * - scroll down when input field increases
     * - prevent double scrollbars in web (no main page scrolling)
     */
    const scrollIntoView = useCallback(() => {
      if (!scrollToInput) return

      if (Platform.OS === 'web') {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      } else {
        const paddingTop = screenHeight < SMALL_DEVICE_HEIGHT ? 50 : 20
        if (scrollContentHeight <= 0) return
        requestAnimationFrame(() =>
          scrollViewRef.current?.scrollTo({
            animated: true,
            y: scrollContentHeight - keyboardHeight + SUBMIT_BUTTON_CONTAINER_HEIGHT - paddingTop,
          })
        )
      }
    }, [scrollContentHeight, keyboardHeight, screenHeight, scrollToInput])

    useEffect(scrollIntoView, [scrollContentHeight, scrollIntoView])
    useEffect(scrollIntoView, [maxViewPortHeight, scrollIntoView])

    const styles = useMemo(() => getStyles(screenHeight, theme), [screenHeight, theme])

    return (
      <KeyboardAvoidingView
        behavior={behavior || (Platform.OS === 'ios' ? 'padding' : 'height')}
        style={styles.pageView}
        keyboardVerticalOffset={isModal ? 98 : 0} // based on the height of the HoliModal's header
        ref={ref}
      >
        <HoliKeyboardSaveView
          onHeightChange={onHeightChange}
          style={styles.keyboardSaveView}
          initialOffsetTop={
            initialOffsetTop ?? (showBottomBar && Platform.OS === 'web' ? dimensions.bottomBarHeight : 0)
          }
        >
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={scrollIntoView}
            style={styles.scrollView}
            {...scrollViewProps}
          >
            <View
              onLayout={(event) => setScrollContentHeight(event.nativeEvent?.layout?.height)}
              style={[mixins.container, styles.scrollContent]}
            >
              {renderProp(scrollToInputWithId)}
            </View>
          </ScrollView>
          <SafeArea edges={['bottom']} style={[styles.bottomBar, bottomBarStyle]}>
            <View style={[mixins.container, styles.buttonContainer]}>
              {showBackButton && (
                <ButtonIcon
                  variant="secondary"
                  size="md"
                  label={backButtonLabel || t('global.back')}
                  testID={`${testID}-back-btn`}
                  onPress={onBack}
                  icon={ArrowLeft}
                />
              )}
              {showCancelButton && (
                <View style={styles.backButton}>
                  <Button
                    variant="secondary"
                    size="md"
                    label={backButtonLabel || t('global.back')}
                    testID={`${testID}-back-btn`}
                    inline
                    onPress={onCancel}
                  />
                </View>
              )}
              <View style={styles.saveButton}>
                <Button
                  inline
                  size="md"
                  disabled={saveButtonDisabled}
                  loading={saveButtonLoading}
                  loadingLabel={t('global.loading')}
                  label={buttonLabel || t('global.save')}
                  onPress={onSave}
                  testID={`${testID}-save-btn`}
                />
              </View>
            </View>
          </SafeArea>
        </HoliKeyboardSaveView>
      </KeyboardAvoidingView>
    )
  }
)

FormWrapper.displayName = 'FormWrapper'

export default FormWrapper

const getStyles = (screenHeight: number, theme: HoliTheme) =>
  StyleSheet.create({
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
    scrollView: {
      flex: 1,
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
      paddingBottom: 25,
      ...Platform.select({
        web: {
          marginHorizontal: 'auto',
        },
      }),
    },
    scrollContent: {
      paddingBottom: SUBMIT_BUTTON_CONTAINER_HEIGHT,
      ...Platform.select({
        web: {
          paddingBottom: screenHeight > SMALL_DEVICE_HEIGHT ? 0 : -SUBMIT_BUTTON_CONTAINER_HEIGHT,
        },
      }),
    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        web: {
          position: 'relative',
        },
      }),
    },
    buttonContainer: {
      width: '100%',
      zIndex: 2,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: SUBMIT_BUTTON_CONTAINER_HEIGHT,
      gap: 10,
      ...Platform.select({
        web: {
          maxWidth: dimensions.maxScreenWidth,
          marginHorizontal: 'auto',
        },
      }),
    },
    backButton: {
      flex: 1,
    },
    saveButton: {
      flex: 1,
      ...Platform.select({
        web: {
          maxWidth: 600,
        },
      }),
    },
  })
