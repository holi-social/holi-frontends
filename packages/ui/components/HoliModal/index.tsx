import React, { useEffect, useRef, useState } from 'react'
import { Animated, Modal, ModalProps, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliModalProps = ModalProps & {
  show: boolean
  onDismiss: () => void
  relativeHeight?: number
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild>
}

const HoliModal: React.FunctionComponent<HoliModalProps> = (props: HoliModalProps) => {
  const { show, relativeHeight, onDismiss, children, testID } = props
  const { theme } = useTheme()
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()
  const styles = getStyles(theme)

  const modalHeight = deviceHeight * (relativeHeight || 0.75) // default height is 75% of screen size
  const [visible, setVisible] = useState(show)
  const bottom = useRef(new Animated.Value(-modalHeight)).current

  const onGesture = (event: any) => {
    if (event.nativeEvent.translationY > 0) {
      bottom.setValue(-event.nativeEvent.translationY)
    }
  }

  const onGestureEnd = (event: any) => {
    // if dragged more than half of the height down, dismiss the modal
    if (event.nativeEvent.translationY > modalHeight / 2) {
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
  }, [show])

  return (
    <Modal visible={visible} transparent={true}>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
        >
          <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
            <View
              style={[
                styles.header,
                styles.common,
                {
                  position: 'relative',
                  shadowOffset: {
                    width: deviceWidth,
                    height: 3,
                  },
                },
              ]}
            >
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    root: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: theme.colors.backgroundColorWhite,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
    },
    header: {
      height: 44,
      backgroundColor: theme.colors.backgroundColorWhite,
      justifyContent: 'center',
      alignItems: 'center',
    },
    handle: {
      width: 33,
      height: 4,
      borderRadius: 4,
      position: 'absolute',
      top: 8,
      zIndex: 10,
      backgroundColor: theme.colors.softblackTransparent,
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
    backDrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 80,
      backgroundColor: 'rgba(0,0,0, 0.5)',
    },
  })
