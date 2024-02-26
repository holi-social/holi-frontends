import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, LayoutRectangle, StyleSheet, View } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { HoliSkeletonProps } from './types'

// inspired by https://github.com/chramos/react-native-skeleton-placeholder/blob/master/src/skeleton-placeholder.tsx
// (which is not compatible to our stack, because it clashes with expo)

const gradientWidth = 0.75 // relative

// disclaimer: animation jumps to the right when re-rendered via hot reloading in dev
const HoliSkeleton = (props: PropsWithChildren<HoliSkeletonProps>) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(props, theme), [props, theme])

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
    return <View style={styles.placeholder} onLayout={(e) => setLayout(e.nativeEvent.layout)} testID={props.testID} />
  }

  return (
    <MaskedView style={styles.maskView} maskElement={<View style={styles.maskElement} />} testID={props.testID}>
      <View style={[StyleSheet.absoluteFill, styles.background]} />
      <Animated.View
        style={{
          transform: [
            {
              translateX: animatedValueRef.current.interpolate({
                inputRange: [0, 1],
                outputRange: [-(layout.width * gradientWidth), layout.width],
              }),
            },
          ],
        }}
      >
        {/* also achievable with react-native-svg if this causes problems */}
        <LinearGradient
          colors={[
            colors.skeletonGradient1,
            colors.skeletonGradient2,
            colors.skeletonGradient3,
            colors.skeletonGradient4,
            colors.skeletonGradient5,
          ]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </MaskedView>
  )
}

const getStyles = ({ aspectRatio, height, width, borderRadius }: HoliSkeletonProps, theme: HoliTheme) => {
  return StyleSheet.create({
    placeholder: {
      aspectRatio,
      height,
      width,
      borderRadius,
      backgroundColor: 'transparent',
    },
    maskView: {
      aspectRatio,
      height,
      width,
      borderRadius,
    },
    maskElement: {
      height: '100%',
      width: '100%',
      borderRadius,
      backgroundColor: 'black', // masking is based on transparency
    },
    background: {
      backgroundColor: theme.colors.skeletonGradient1,
    },
    gradient: {
      height: '100%',
      width: gradientWidth * 100 + '%',
    },
  })
}

export default React.memo(HoliSkeleton)
