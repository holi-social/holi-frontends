import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'

import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useKeyboard } from '@holi/ui/helper'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface FormWrapperProps extends ScrollViewProps {
  renderProp: (scrollToPropsFor: ReturnType<typeof useScrollToInputOnFocus>) => React.ReactNode
  onSave: () => Promise<unknown>
  scrollToInput?: boolean
  initialOffsetTop?: number
  saveButtonDisabled?: boolean
  isModal?: boolean
  buttonLabel?: string
  showBottomBar?: boolean
}

const SUBMIT_BUTTON_CONTAINER_HEIGHT = 64
const SMALL_DEVICE_HEIGHT = 600

const FormWrapper = React.forwardRef<KeyboardAvoidingView, FormWrapperProps>(
  (
    {
      renderProp,
      onSave,
      initialOffsetTop,
      saveButtonDisabled,
      isModal = false,
      buttonLabel,
      showBottomBar = false,
      scrollToInput = true,
      testID = 'form-wrapper',
      ...scrollViewProps
    }: FormWrapperProps,
    ref
  ) => {
    const [maxViewPortHeight, setMaxViewPortHeight] = useState(0)
    const [scrollContentHeight, setScrollContentHeight] = useState(0)
    const scrollViewRef = useRef<ScrollView>(null)
    const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)
    const mixins = useStyleMixins()
    const { height: screenHeight } = useWindowDimensions()
    const { keyboardHeight } = useKeyboard()
    const { t } = useTranslation()
    const label = buttonLabel || t('global.save')

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

    const styles = createStyles(screenHeight)

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.pageView}
        keyboardVerticalOffset={isModal ? 98 : 0} // based on the height of the HoliModal's header
        ref={ref}
      >
        <HoliKeyboardSaveView
          onHeightChange={onHeightChange}
          style={styles.keyboardSaveView}
          initialOffsetTop={initialOffsetTop ?? (showBottomBar && Platform.OS === 'web' ? +vars.bottomBarHeight : 0)}
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
          <SafeAreaView style={[styles.bottomBar]}>
            <View style={[mixins.container, styles.buttonContainer]}>
              <HoliButtonLoading
                inline
                variant="medium"
                disabled={saveButtonDisabled}
                label={label}
                loadingLabel={t('global.loading')}
                onPress={onSave}
                testID={`${testID}-save-btn`}
                style={styles.button}
              >
                {t('global.save')}
              </HoliButtonLoading>
            </View>
          </SafeAreaView>
        </HoliKeyboardSaveView>
      </KeyboardAvoidingView>
    )
  }
)

FormWrapper.displayName = 'FormWrapper'

export default FormWrapper

const createStyles = (screenHeight: number) =>
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
      maxWidth: vars.maxScreenWidth,
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
      borderTopColor: colors.background30,
      backgroundColor: colors.background20,
      ...Platform.select({
        web: {
          position: 'relative',
        },
      }),
    },
    buttonContainer: {
      width: '100%',
      zIndex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      height: SUBMIT_BUTTON_CONTAINER_HEIGHT,
      ...Platform.select({
        web: {
          maxWidth: vars.maxScreenWidth,
          marginHorizontal: 'auto',
        },
      }),
    },
    button: {
      width: '100%',
      ...Platform.select({
        web: {
          maxWidth: 600,
        },
      }),
    },
  })
