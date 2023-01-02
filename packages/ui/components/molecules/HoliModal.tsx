import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, ModalProps, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'
import {
  GestureEvent,
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PanGestureHandler,
} from 'react-native-gesture-handler'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import ModalBasic from '@holi/ui/components/molecules/ModalBasic'
import { colors } from '@holi/ui/styles/globalVars'
import { vars } from '@holi/ui/styles/globalVars'

/**
 *
 * @returns 100 (full screen) for heights above the MIN_HEIGHT_THRESHOLD, or a fixedHeight based on relativeHeight, minRelativeHeight and maxHeight
 */
const getFixedHeight = (relativeHeight: number, maxHeight: number, minRelativeHeight?: number) => {
  const MIN_HEIGHT_THRESHOLD = 0.94
  const fixedHeight = minRelativeHeight ? Math.min(minRelativeHeight, relativeHeight) * 100 : maxHeight

  return fixedHeight >= MIN_HEIGHT_THRESHOLD ? 100 : fixedHeight
}

export type HoliModalProps = ModalProps & {
  show: boolean
  label: string
  onDismiss: () => void
  relativeHeight?: number
  minRelativeHeight?: number
  autoHeight?: boolean
  testID?: string
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild>
}

/*
  "relativeHeight" with "autoHeight === true" works like "max-height"
  "relativeHeight" with "autoHeight === false" works like fix "height"
  "minRelativeHeight" is "min-height" and if "minRelativeHeight" is bigger than "relativeHeight" the lower value will be used
*/
const HoliModal: React.FC<HoliModalProps> = ({
  show = false,
  label,
  onDismiss,
  relativeHeight = 1,
  minRelativeHeight,
  testID,
  autoHeight = true,
  children,
}) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(show)
  const { width: deviceWidth } = useWindowDimensions()
  const [isTouch, setIsTouch] = useState(true)

  // value for appearance animation
  const animShift = useRef(new Animated.Value(0)).current
  const animShiftInterpolated = animShift.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '-100%'],
  })
  // value for user gestures
  const gestureShift = useRef(new Animated.Value(0)).current

  const onGesture = (event: GestureEvent) => {
    if (typeof event.nativeEvent.translationY == 'number' && event.nativeEvent.translationY > 0) {
      gestureShift.setValue(event.nativeEvent.translationY)
    }
  }

  const onGestureEnd = (event: HandlerStateChangeEvent) => {
    // if dragged more than 150px down, dismiss the modal
    if (typeof event.nativeEvent.translationY == 'number' && event.nativeEvent.translationY > 150) {
      onDismiss()
    } else {
      Animated.timing(gestureShift, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start()
    }
  }

  useEffect(() => {
    if (show) {
      setVisible(show)
      Animated.timing(animShift, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
        delay: 300,
      }).start()
    } else {
      Animated.timing(animShift, {
        toValue: 1,
        duration: 350,
        useNativeDriver: false,
      }).start(() => {
        // only dismiss the Modal once the animation is done
        setVisible(false)
        gestureShift.setValue(0)
      })
    }
  }, [show, animShift, gestureShift, setVisible])

  useLayoutEffect(() => {
    if (Platform.OS === 'web') {
      navigator && navigator.maxTouchPoints != 0 ? setIsTouch(true) : setIsTouch(false)
    }
  }, [])

  const maxHeight = relativeHeight * 100
  const minHeight = minRelativeHeight ? Math.min(minRelativeHeight, relativeHeight) * 100 : 0
  const fixedHeight = getFixedHeight(relativeHeight, maxHeight, minRelativeHeight)

  return (
    <>
      <ModalBasic show={visible} transparent={true} onDismiss={onDismiss} label={label} testID={testID}>
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
                transform: [{ translateY: gestureShift }],
                maxHeight: `${maxHeight}%`,
                minHeight: `${minHeight}%`,
                ...(!autoHeight && { height: `${fixedHeight}%` }),
              },
              fixedHeight === 100 ? styles.fullscreen : {},
            ]}
            testID={`${testID}-animatedview`}
          >
            <View style={styles.headerContainer}>
              {isTouch && deviceWidth < +vars.breakpointL ? (
                <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
                  <View style={styles.handle}>
                    <HoliButton label={t('modal.backdrop')} style={{ padding: 10 }} onPress={onDismiss} transparent>
                      <View style={styles.line} />
                    </HoliButton>
                  </View>
                </PanGestureHandler>
              ) : (
                <HoliButton
                  label={t('modal.backdrop')}
                  style={styles.dismissIcon}
                  onPress={onDismiss}
                  inline={true}
                  transparent
                >
                  <HoliIcon icon="close" color={colors.fontColorBlack} size={25} />
                </HoliButton>
              )}
            </View>
            {children}
          </Animated.View>
        </GestureHandlerRootView>
      </ModalBasic>
    </>
  )
}

export default HoliModal

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  root: {
    backgroundColor: colors.backgroundColorWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingTop: 47,
    shadowColor: '#000',
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
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
  handle: {
    height: 40,
    backgroundColor: colors.backgroundColorWhite,
    alignItems: 'center',
  },
  line: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.backgroundColorBlack,
    opacity: 0.3,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    opacity: 0.4,
    backgroundColor: colors.backgroundColorBlack,
  },
  dismissIcon: {
    alignSelf: 'flex-end',
    padding: 15,
    paddingBottom: 3,
  },
})
