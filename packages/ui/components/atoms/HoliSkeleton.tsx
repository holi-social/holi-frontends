import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import React, { PropsWithChildren, useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'

// inspired by https://github.com/chramos/react-native-skeleton-placeholder/blob/master/src/skeleton-placeholder.tsx#L202
// (which is not compatible to our stack, since it clashes with expo)

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HoliSkeletonProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HoliSkeleton = (props: PropsWithChildren<HoliSkeletonProps>) => {
  const animatedValueRef = useRef(new Animated.Value(0))

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animatedValueRef.current, {
        toValue: 1,
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
        delay: 300,
        useNativeDriver: true, // tested to be on the ui thread
      })
    )
    loop.start()
    return () => loop.stop()
  }, [])

  return (
    <MaskedView style={styles.maskView} maskElement={<View style={styles.maskElement} />}>
      <View style={[StyleSheet.absoluteFill, styles.background]} />
      <Animated.View
        style={{
          transform: [
            {
              translateX: animatedValueRef.current.interpolate({
                inputRange: [0, 1],
                outputRange: [-200, 200],
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
  maskView: {
    height: 100,
    width: 200,
  },
  maskElement: {
    height: 100,
    width: 200,
    borderRadius: 4,
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
