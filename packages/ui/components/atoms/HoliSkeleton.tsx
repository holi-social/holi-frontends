import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Animated, Easing, LayoutRectangle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

// inspired by https://github.com/chramos/react-native-skeleton-placeholder/blob/master/src/skeleton-placeholder.tsx
// (which is not compatible to our stack, because it clashes with expo)

interface HoliSkeletonProps {
  style?: StyleProp<ViewStyle>
}

const HoliSkeleton = (props: PropsWithChildren<HoliSkeletonProps>) => {
  const [layout, setLayout] = useState<LayoutRectangle>()
  const animatedValueRef = useRef(new Animated.Value(0))

  useEffect(() => {
    const loop = Animated.loop(
      // remember, you can also make this a sequence
      Animated.timing(animatedValueRef.current, {
        toValue: 1,
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
        // delay: 300, // doesn't look good
        useNativeDriver: true, // tested to be on the ui thread
      })
    )
    loop.start()
    return () => loop.stop()
  }, [])

  if (!layout) {
    return <View style={[styles.placeholder, props.style]} onLayout={(e) => setLayout(e.nativeEvent.layout)} />
  }

  return (
    <MaskedView style={[styles.maskView, props.style]} maskElement={<View style={[styles.maskElement, props.style]} />}>
      <View style={[StyleSheet.absoluteFill, styles.background]} />
      <Animated.View
        style={{
          transform: [
            {
              translateX: animatedValueRef.current.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  -(layout.width / 2), // because gradient is 50% of width
                  layout.width,
                ],
              }),
            },
          ],
        }}
      >
        {/* also achievable with react-native-svg if this causes problems */}
        <LinearGradient
          colors={['#D9D9D900', '#DADADA80', '#DBDBDBE6', '#DADADA80', '#D9D9D900']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </MaskedView>
  )
}

const styles = StyleSheet.create({
  placeholder: {
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  maskView: {
    height: '100%',
    width: '100%',
  },
  maskElement: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black', // masking is based on transparency
  },
  background: {
    backgroundColor: '#EBEBEB',
  },
  gradient: {
    height: '100%',
    width: '50%',
  },
})

export default HoliSkeleton
