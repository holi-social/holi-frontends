import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useKeyboard } from '@holi/ui/helper'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { useSetScreenOptions } from '../navigation/hooks/useScreenOptions'

interface Props extends ScrollViewProps {
  renderProp: (scrollToPropsFor: ReturnType<typeof useScrollToInputOnFocus>) => React.ReactNode
  padTopBar?: boolean
  isModal?: boolean
  bottomContent?: React.ReactNode
}

const SUBMIT_BUTTON_CONTAINER_HEIGHT = 64
const SMALL_DEVICE_HEIGHT = 600

const FormWrapper = React.forwardRef<ScrollView, Props>(
  ({ renderProp, padTopBar = true, isModal = false, bottomContent, ...scrollViewProps }: Props, ref) => {
    const [maxViewPortHeight, setMaxViewPortHeight] = useState(0)
    const [scrollContentHeight, setScrollContentHeight] = useState(0)
    const scrollViewRef = useRef<ScrollView>(null)
    const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)
    const mixins = useStyleMixins()
    const { height: screenHeight } = useWindowDimensions()
    const { keyboardHeight } = useKeyboard()

    const initialOffsetTop = useMemo(() => (isModal ? 70 : 0), [Platform.OS, isModal])
    console.log(initialOffsetTop)

    const onHeightChange = useCallback((newContainerHeight: number) => {
      const newScrollViewHeight = newContainerHeight - SUBMIT_BUTTON_CONTAINER_HEIGHT
      setMaxViewPortHeight(newScrollViewHeight)
    }, [])

    /**
     * The view should:
     * - scroll input field into viewport (with open keyboard)
     * - scroll down when input field increases
     * - leave scrolling space to show 5 suggestions below
     * - prevent double scrollbars in web (no main page scrolling)
     */
    const scrollIntoView = useCallback(() => {
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
    }, [scrollContentHeight, keyboardHeight, screenHeight])

    useEffect(scrollIntoView, [scrollContentHeight, scrollIntoView])
    useEffect(scrollIntoView, [maxViewPortHeight, scrollIntoView])

    const styles = createStyles(padTopBar, screenHeight)

    return (
      <>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.pageView}>
          <HoliKeyboardSaveView onHeightChange={onHeightChange} initialOffsetTop={initialOffsetTop}>
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
            {/* Bottom Bar */}
            <View style={[styles.bottomBar]}>
              <View style={[styles.buttonContainer]}>
                <HoliButton
                  disabled={false}
                  label={'test'}
                  variant="small"
                  inline
                  onPress={() => console.log('hello')}
                  testID="btn-submit-comment"
                >
                  {'Save'}
                </HoliButton>
              </View>
            </View>
          </HoliKeyboardSaveView>
        </KeyboardAvoidingView>
      </>
    )
  }
)

FormWrapper.displayName = 'FormWrapper'

export default FormWrapper

const createStyles = (padTopBar: boolean, screenHeight: number) =>
  StyleSheet.create({
    pageView: {
      paddingTop: padTopBar ? vars.topBarHeight + 10 : 0,
      height: '100%', // prevents double scrollbars
      overflow: 'hidden',
      ...Platform.select({
        web: {
          // minHeight: '100vh',
          marginHorizontal: 'auto',
        },
        android: {
          paddingBottom: 0,
        },
      }),
    },
    scrollView: {
      flex: 1,
      width: '100%',
      maxWidth: vars.maxScreenWidth,
      marginHorizontal: 'auto',
      paddingBottom: 25,
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
      alignItems: 'flex-end',
      height: SUBMIT_BUTTON_CONTAINER_HEIGHT,
      ...Platform.select({
        web: {
          maxWidth: vars.maxScreenWidth,
          marginHorizontal: 'auto',
        },
      }),
    },
  })
