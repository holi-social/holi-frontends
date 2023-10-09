import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Animated,
  ModalProps,
  Platform,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import {
  GestureEvent,
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PanGestureHandler,
} from 'react-native-gesture-handler'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'
import { isWebTouchDevice } from '@holi/ui/helper'
import { colors } from '@holi/ui/styles/globalVars'

const FULLSCREEN_HEIGHT_THRESHOLD = 0.94

/**
 * "relativeHeight" is a percentage value (from 0 to 1). When its value is 1 and autoHeight is false, the modal is fullscreen.
 * "relativeHeight" with "autoHeight === true" works like "max-height"
 * "relativeHeight" with "autoHeight === false" works like fixed "height"
 * `onDismiss` is onpional, means if no function is provided the modal in undismissable and can be shown or hidden only throught `show` prop
 */
export interface HoliModalProps extends ModalProps {
  show: boolean
  label: string
  onDismiss?: () => void
  heading?: string
  relativeHeight?: number
  autoHeight?: boolean
  headerStyle?: ViewStyle
  style?: StyleProp<ViewStyle>
  testID?: string
}

export const useModalState = ({
  visible = false,
  onDismiss,
}: Partial<Pick<HoliModalProps, 'onDismiss' | 'visible'>> = {}) => {
  const [modalVisible, setModalVisible] = useState(visible)

  const show = useCallback(() => setModalVisible(true), [])
  const hide = useCallback(() => setModalVisible(false), [])

  const dismissHandler = useCallback(() => {
    setModalVisible(false)
    onDismiss?.()
  }, [onDismiss])

  return {
    visible: modalVisible,
    show,
    hide,
    props: {
      show: modalVisible,
      onDismiss: dismissHandler,
    },
  }
}

const HoliModal: React.FC<HoliModalProps> = ({
  show = false,
  label,
  onDismiss,
  heading,
  relativeHeight = 0.9,
  autoHeight = true,
  headerStyle,
  children,
  style,
  testID,
}) => {
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const [contentHeight, setContentHeight] = useState(0)

  // value for appearance animation
  const animShiftRef = useRef(new Animated.Value(0))
  const animShiftInterpolated = animShiftRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '-100%'],
  })

  // value for user gestures
  const gestureShiftRef = useRef(new Animated.Value(0))

  const onGesture = (event: GestureEvent) => {
    if (typeof event.nativeEvent.translationY == 'number' && event.nativeEvent.translationY > 0) {
      gestureShiftRef.current.setValue(event.nativeEvent.translationY)
    }
  }

  const onGestureEnd = (event: HandlerStateChangeEvent) => {
    // if dragged more than 150px down, dismiss the modal
    // TODO: use relative, screen height based value instead of absolute
    if (typeof event.nativeEvent.translationY == 'number' && event.nativeEvent.translationY > 150) {
      onDismiss?.()
    } else {
      Animated.timing(gestureShiftRef.current, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start()
    }
  }

  useEffect(() => {
    if (show) {
      Animated.timing(animShiftRef.current, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
        delay: 300,
      }).start()
      return
    }

    Animated.timing(animShiftRef.current, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start(() => {
      // only dismiss the Modal once the animation is done
      gestureShiftRef.current.setValue(0)
    })
  }, [show, animShiftRef, gestureShiftRef])

  // any height above or equal to the threshold should default to 100% height
  const height = useMemo(
    () => (relativeHeight >= FULLSCREEN_HEIGHT_THRESHOLD || contentHeight >= deviceHeight ? 100 : relativeHeight * 100),
    [relativeHeight, contentHeight, deviceHeight]
  )

  const isFullscreen = height === 100
  const isMobile = Platform.OS !== 'web'
  const isTouchDevice = isWebTouchDevice() || isMobile

  return (
    <>
      <ModalBasic show={show} transparent={true} onDismiss={onDismiss} label={label} testID={testID}>
        <GestureHandlerRootView style={styles.rootView} accessible={false}>
          <HoliButton
            label={t('modal.backdrop')}
            style={styles.backdrop}
            onPress={onDismiss}
            transparent
            testID={`${testID}-backdrop`}
          >
            <View onAccessibilityEscape={onDismiss} style={styles.backdrop} />
          </HoliButton>

          <Animated.View
            style={[
              styles.root,
              {
                bottom: animShiftInterpolated,
                transform: [{ translateY: gestureShiftRef.current }],
                maxHeight: `${height}%`,
                ...(!autoHeight && { height: `${height}%` }),
              },
              isFullscreen && styles.fullscreen,
              style,
            ]}
            onLayout={(event) => {
              const { height: modalContentHeight } = event.nativeEvent.layout

              if (!autoHeight) {
                setContentHeight(modalContentHeight)
              }
            }}
            testID={`${testID}-animatedview`}
          >
            <SafeAreaView style={[styles.headerContainer, headerStyle]}>
              {/* not fullscreen modal on touch device */}
              {!isFullscreen && isTouchDevice ? (
                <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
                  <View style={styles.handle}>
                    {onDismiss && (
                      <HoliButton
                        label={t('modal.backdrop')}
                        onPress={onDismiss}
                        transparent
                        style={styles.lineButton}
                        testID={`btn-to-close-${testID}`}
                      >
                        <View style={styles.line} />
                      </HoliButton>
                    )}
                  </View>
                </PanGestureHandler>
              ) : !!onDismiss || !!heading ? (
                <View style={styles.heading}>
                  {!!onDismiss && (
                    <HoliButton
                      label={t('modal.backdrop')}
                      style={[styles.dismissIcon, isTouchDevice && styles.dismissIconMobile]}
                      onPress={onDismiss}
                      transparent
                      testID={`btn-to-close-${testID}`}
                    >
                      <HoliIcon icon={isTouchDevice ? ArrowDownS : Close} color={colors.foreground30} size={25} />
                    </HoliButton>
                  )}

                  {!!heading && (
                    <HoliHeading
                      level="2"
                      style={styles.title}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      testID={`${testID}-heading`}
                    >
                      {heading}
                    </HoliHeading>
                  )}
                </View>
              ) : null}
            </SafeAreaView>

            {children}
          </Animated.View>
        </GestureHandlerRootView>
      </ModalBasic>
    </>
  )
}

export default memo(HoliModal)

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  root: {
    backgroundColor: colors.background10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.foreground30,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  fullscreen: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  headerContainer: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: 18,
    ...Platform.select({
      web: {
        alignSelf: 'flex-end',
      },
    }),
  },
  handle: {
    height: 40,
    alignItems: 'center',
    alignSelf: 'center',
  },
  lineButton: {
    padding: 15,
  },
  line: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.foreground30,
    opacity: 0.3,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    opacity: 0.4,
    backgroundColor: colors.foreground30,
  },
  dismissIcon: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    position: 'absolute',
    width: 'auto',
    zIndex: 1,
    right: 0,
    top: 0,
  },
  dismissIconMobile: {
    left: 0,
  },
  heading: {
    marginTop: 20,
    height: 30,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    width: '80%',
  },
})
