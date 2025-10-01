import type React from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Animated,
  type ModalProps,
  TouchableOpacity,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  useWindowDimensions,
} from 'react-native'
import {
  type GestureEvent,
  GestureHandlerRootView,
  type HandlerStateChangeEvent,
  PanGestureHandler,
} from 'react-native-gesture-handler'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'
import { isWebTouchDevice } from '@holi/ui/helper'
import { constants } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Spacing } from 'holi-bricks/foundations'

const FULLSCREEN_HEIGHT_THRESHOLD = 0.94
const IOS_STATUS_BAR_HEIGHT = constants.statusBarHeight

/**
 * "relativeHeight" is a percentage value (from 0 to 1). When its value is 1 and autoHeight is false, the modal is fullscreen.
 * "relativeHeight" with "autoHeight === true" works like "max-height"
 * "relativeHeight" with "autoHeight === false" works like fixed "height"
 * `onDismiss` is onpional, means if no function is provided the modal in undismissable and can be shown or hidden only throught `show` prop
 */
export interface HoliModalProps extends ModalProps {
  shown: boolean
  label: string
  onDismiss?: () => void
  heading?: string
  dismissBtnContent?: React.ReactNode
  relativeHeight?: number
  autoHeight?: boolean
  headerStyle?: ViewStyle
  desktop?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
  backgroundColor?: string
}

export interface UseModalStateHookConfig {
  onDismiss?: () => void
  initiallyVisible?: boolean
}

export interface UseModalStateHook {
  hide: () => void
  show: () => void
  /** @deprecated don't bind to the internal state value,
   * forward the returned props to the holi-modal instead
   * and let the hook handle the showing and hiding **/
  visible: boolean
  props: {
    onDismiss: () => void
    shown: boolean
  }
}

export const useModalState = (config?: UseModalStateHookConfig): UseModalStateHook => {
  const [modalVisible, setModalVisible] = useState(config?.initiallyVisible ?? false)

  const show = useCallback(() => setModalVisible(true), [])
  const hide = useCallback(() => setModalVisible(false), [])

  const dismissHandler = useCallback(() => {
    hide()
    config?.onDismiss?.()
  }, [config, hide])

  return {
    visible: modalVisible,
    show,
    hide,
    props: {
      shown: modalVisible,
      onDismiss: dismissHandler,
    },
  }
}

const HoliModal: React.FC<HoliModalProps> = ({
  shown = false,
  label,
  onDismiss,
  heading,
  dismissBtnContent,
  relativeHeight = 0.9,
  autoHeight = true,
  headerStyle,
  children,
  desktop = false,
  style,
  testID,
  backgroundColor,
}) => {
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const [contentHeight, setContentHeight] = useState(0)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme, backgroundColor), [theme, backgroundColor])

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
    if (shown) {
      Animated.timing(animShiftRef.current, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
        delay: 0,
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
  }, [shown, animShiftRef, gestureShiftRef])

  // any height above or equal to the threshold should default to 100% height
  const height = useMemo(
    () => (relativeHeight >= FULLSCREEN_HEIGHT_THRESHOLD || contentHeight >= deviceHeight ? 100 : relativeHeight * 100),
    [relativeHeight, contentHeight, deviceHeight]
  )

  const isFullscreen = height === 100
  const isTouchDevice = isWebTouchDevice() || Platform.OS !== 'web'

  let header: React.ReactNode = null
  if (isFullscreen || heading || !isTouchDevice) {
    header = (
      <View style={styles.heading}>
        {!!onDismiss && (
          <View style={[styles.dismissIcon, isTouchDevice && styles.dismissIconMobile]}>
            <HoliButton
              label={t('modal.backdrop')}
              onPress={onDismiss}
              transparent
              inline
              testID={`btn-to-close-${testID}`}
            >
              {dismissBtnContent || (
                <HoliIcon icon={isTouchDevice ? ArrowDownS : Close} colorOverride={colors.foreground30} size={24} />
              )}
            </HoliButton>
          </View>
        )}

        {!!heading && (
          <View style={styles.titleContainer}>
            <HoliHeading level="2" align="center" ellipsizeMode="tail" numberOfLines={1} testID={`${testID}-heading`}>
              {heading}
            </HoliHeading>
          </View>
        )}
      </View>
    )
  } else if (isTouchDevice && onDismiss && !heading) {
    header = (
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
    )
  }

  return (
    <ModalBasic shown={shown} transparent={true} onDismiss={onDismiss} label={label} testID={testID}>
      <GestureHandlerRootView style={[styles.rootView, desktop && styles.rootViewDesktop]} accessible={false}>
        <HoliButton
          label={t('modal.backdrop')}
          style={styles.backdrop}
          onPress={onDismiss}
          disabled={!onDismiss}
          transparent
          testID={`${testID}-backdrop`}
        >
          <View onAccessibilityEscape={onDismiss} style={styles.backdrop} />
        </HoliButton>

        {desktop ? (
          <Animated.View style={[styles.rootDesktop, style]}>
            {children}

            {onDismiss && (
              <TouchableOpacity
                accessibilityLabel={t('modal.close')}
                accessibilityRole="button"
                testID={`${testID}-close-button`}
                onPress={onDismiss}
                style={styles.closeButton}
              >
                <HoliIcon size={24} icon={Close} />
              </TouchableOpacity>
            )}
          </Animated.View>
        ) : (
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
            <View style={[styles.headerContainer, headerStyle]}>{header}</View>

            {children}
          </Animated.View>
        )}
      </GestureHandlerRootView>
    </ModalBasic>
  )
}

export default memo(HoliModal)

const getStyles = (theme: HoliTheme, backgroundColor?: string) =>
  StyleSheet.create({
    rootView: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    rootViewDesktop: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    root: {
      backgroundColor: backgroundColor ?? theme.colors.background10,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
      shadowColor: theme.colors.foreground30,
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
    rootDesktop: {
      backgroundColor: backgroundColor ?? theme.colors.background10,
      borderColor: theme.colors.black300,
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: theme.colors.black300at12percent,
      marginHorizontal: 24,
      maxHeight: '95%',
      shadowOffset: {
        width: 0,
        height: 5,
      },
    },
    fullscreen: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      ...Platform.select({
        ios: {
          paddingTop: IOS_STATUS_BAR_HEIGHT, // avoid the overlapping StatusBar on iOS
        },
      }),
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
      backgroundColor: theme.colors.foreground30,
      opacity: 0.3,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0,
      opacity: 0.4,
      backgroundColor: theme.colors.backdropBackground,
    },
    dismissIcon: {
      alignSelf: 'flex-end',
      padding: 12,
      position: 'absolute',
      width: 'auto',
      zIndex: 1,
      right: 12,
      top: -12,
    },
    dismissIconMobile: {
      left: 12,
      right: 'auto',
    },
    heading: {
      marginTop: 20,
      width: '100%',
      position: 'relative',
      alignItems: 'center',
    },
    titleContainer: {
      width: '80%',
    },
    closeButton: {
      position: 'absolute',
      top: Spacing.lg,
      right: Spacing.lg,
    },
  })
