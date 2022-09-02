import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Modal, ModalProps, StyleSheet, View, useWindowDimensions } from 'react-native'
import {
  GestureEvent,
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PanGestureHandler,
} from 'react-native-gesture-handler'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliModalProps = ModalProps & {
  show: boolean
  onDismiss: () => void
  relativeHeight?: number
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild>
  testID?: string
  label: string
  autoHeight?: boolean
}

const HoliModal: React.FunctionComponent<HoliModalProps> = (props: HoliModalProps) => {
  // default height is 75% of screen size
  const { show = false, relativeHeight = 0.75, onDismiss, children, autoHeight = true } = props
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()

  const styles = getStyles(deviceWidth)
  const { t } = useTranslation()

  const modalHeight = deviceHeight * relativeHeight
  const [modalLayoutHeight, setModalLayoutHeight] = useState(modalHeight)
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
        setModalLayoutHeight(modalHeight)
      })
    }
  }, [show, bottom, modalHeight])

  const calcHeight = () => {
    return Math.min(deviceHeight - styles.header.height, modalLayoutHeight)
  }

  return (
    <>
      <Modal
        onRequestClose={onDismiss}
        visible={visible}
        transparent={true}
        testID={props.testID}
        accessibilityLabel={props.label}
      >
        <GestureHandlerRootView style={styles.rootView} accessible={false}>
          <HoliButton
            label={t('modal.backdrop')}
            onPress={onDismiss}
            style={styles.backdrop}
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
                bottom: bottom,
                shadowOffset: {
                  width: deviceWidth,
                  height: -3,
                },
              },
              styles.common,
              modalLayoutHeight !== modalHeight && {
                height: calcHeight(),
              },
              !autoHeight && {
                height: modalHeight,
              },
            ]}
            // testID={[props.testID, 'animatedview'].filter((e) => e).join('-')}
            onLayout={(event) => {
              setModalLayoutHeight(event.nativeEvent.layout.height)
            }}
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
    </>
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
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0,
      opacity: 0.4,
      backgroundColor: colors.softblack,
    },
  })
