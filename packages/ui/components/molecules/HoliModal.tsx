import React, { useEffect, useRef, useState } from 'react'
import { Animated, Modal, ModalProps, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'
import {
  GestureEvent,
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PanGestureHandler,
} from 'react-native-gesture-handler'

import { colors } from '@holi/ui/styles/globalVars'

export type HoliModalProps = ModalProps & {
  show: boolean
  onDismiss: () => void
  relativeHeight?: number
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild>
  testID?: string
}

const HoliModal: React.FunctionComponent<HoliModalProps> = (props: HoliModalProps) => {
  // default height is 75% of screen size
  const { show = false, relativeHeight = 0.75, onDismiss, children } = props
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()
  const styles = getStyles(deviceWidth)

  const modalHeight = deviceHeight * relativeHeight
  const [visible, setVisible] = useState(show)
  const bottom = useRef(new Animated.Value(-modalHeight)).current

  const onGesture = (event: GestureEvent) => {
    if (typeof event.nativeEvent.translationY == 'number' && event.nativeEvent.translationY > 0) {
      bottom.setValue(-event.nativeEvent.translationY)
    }
  }

  const onGestureEnd = (event: HandlerStateChangeEvent) => {
    // if dragged more than half of the height down, dismiss the modal
    if (typeof event.nativeEvent.translationY == 'number' && event.nativeEvent.translationY > modalHeight / 2) {
      onDismiss()
    } else {
      bottom.setValue(0)
    }
  }

  useEffect(() => {
    if (show) {
      setVisible(show)
      Animated.timing(bottom, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(bottom, {
        toValue: -modalHeight,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        // only dismiss the Modal once the animation is done
        setVisible(false)
      })
    }
  }, [show, bottom, modalHeight])

  return (
    <Modal visible={visible} transparent={true} testID={props.testID}>
      <GestureHandlerRootView style={styles.rootView}>
        <Pressable onPress={onDismiss} style={styles.backDrop} testID="backDrop" />

        <Animated.View
          style={[
            styles.root,
            {
              height: modalHeight,
              bottom: bottom,
              shadowOffset: {
                width: deviceWidth,
                height: -3,
              },
            },
            styles.common,
          ]}
          testID={[props.testID, 'animatedview'].filter((e) => e).join('-')}
        >
          <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
            <View style={[styles.header, styles.common, styles.panView]}>
              <View style={[styles.handle]} />
            </View>
          </PanGestureHandler>
          {children}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  )
}

export default HoliModal

const getStyles = (deviceWidth: number) =>
  StyleSheet.create({
    rootView: { flex: 1 },
    root: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: colors.backgroundColorWhite,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
    },
    header: {
      height: 44,
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
    panView: {
      position: 'relative',
      shadowOffset: {
        width: deviceWidth,
        height: 3,
      },
    },
    closeIcon: {
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 10,
    },
    backDrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 80,
      opacity: 0.4,
      backgroundColor: colors.softblack,
    },
  })
