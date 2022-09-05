import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Modal, ModalProps, StyleSheet, View } from 'react-native'
import {
  GestureEvent,
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PanGestureHandler,
} from 'react-native-gesture-handler'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

export type HoliModalProps = ModalProps & {
  show: boolean
  onDismiss: () => void
  relativeHeight?: number
  minRelativeHeight?: number
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild>
  testID?: string
  label: string
  autoHeight?: boolean
}

/*
  "relativeHeight" with "autoHeight === true" works like "max-height"
  "relativeHeight" with "autoHeight === false" works like fix "height"
  "minRelativeHeight" is "min-height" and if "minRelativeHeight" is bigger than "relativeHeight" the lower value will be used
*/

const HoliModal: React.FC<HoliModalProps> = (props) => {
  const { show = false, relativeHeight = 0.9, minRelativeHeight, onDismiss, autoHeight = true, children } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(show)
  const { setModalIsOpen } = useTheme()

  const setModalOpen = (isOpen: boolean) => {
    setVisible(isOpen)
    setModalIsOpen(isOpen)
  }

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
      setModalOpen(show)
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
        setModalOpen(false)
        gestureShift.setValue(0)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, animShift, gestureShift])

  return (
    <>
      <Modal
        onRequestClose={onDismiss}
        visible={visible}
        transparent={true}
        testID={props.testID}
        accessibilityLabel={props.label}
        animationType="fade"
      >
        <GestureHandlerRootView style={styles.rootView} accessible={false}>
          <HoliButton
            label={t('modal.backdrop')}
            style={styles.backdrop}
            onPress={onDismiss}
            transparent
            disableFocusability
            testID={`${props.testID}-backdrop`}
          >
            <View onAccessibilityEscape={onDismiss} style={styles.backdrop} />
          </HoliButton>

          <Animated.View
            style={[
              styles.root,
              {
                bottom: animShiftInterpolated,
                transform: [{ translateY: gestureShift }],
                maxHeight: `${relativeHeight * 100}%`,
                ...(minRelativeHeight && { minHeight: `${Math.min(minRelativeHeight, relativeHeight) * 100}%` }),
              },
              styles.common,
              !autoHeight && styles.rootFixHeight,
            ]}
          >
            <View style={styles.panGestureContainer}>
              <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
                <View style={[styles.header, styles.common]}>
                  <View style={[styles.handle]} />
                </View>
              </PanGestureHandler>
            </View>
            {children}
          </Animated.View>
        </GestureHandlerRootView>
      </Modal>
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
    paddingTop: 40,
  },
  rootFixHeight: {
    flex: 1,
  },
  panGestureContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  header: {
    height: 40,
    backgroundColor: colors.backgroundColorWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    position: 'absolute',
    top: 10,
    zIndex: 10,
    backgroundColor: colors.softblack,
    opacity: 0.3,
  },
  common: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    opacity: 0.4,
    backgroundColor: colors.softblack,
  },
})
