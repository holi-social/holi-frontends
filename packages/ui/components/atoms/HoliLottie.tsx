import LottieView from 'lottie-react-native'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { StyleSheet, type ViewStyle, type StyleProp } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { animations } from '../../lottie-animations'

export interface HoliLottieProps {
  animType: keyof typeof animations
  loop?: boolean
  style?: StyleProp<ViewStyle>
  autoplay?: boolean
}

export interface HoliLottieHandle {
  play: () => void
  reset: () => void
  pause: () => void
}

const HoliLottie = forwardRef<HoliLottieHandle, HoliLottieProps>(
  ({ animType, loop = true, style, autoplay = false }, ref) => {
    const lottieRef = useRef<LottieView>(null)

    useImperativeHandle(ref, () => ({
      play: () => lottieRef.current?.play(),
      pause: () => lottieRef.current?.pause(),
      reset: () => lottieRef.current?.reset(),
    }))

    return (
      <LottieView
        ref={lottieRef}
        source={animations[animType]}
        loop={loop}
        autoPlay={autoplay}
        style={[styles.view, style]}
        progress={0.2}
      />
    )
  }
)

// Version 6 of lottie-react-native removed default styles, so during migration from v5 to
// these styles were taken from the v5 snapshot
// See also https://github.com/lottie-react-native/lottie-react-native/blob/master/MIGRATION-5-TO-6.md#migration-from-version-5-to-6
const styles = StyleSheet.create({
  view: {
    aspectRatio: 1,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
})

HoliLottie.displayName = 'HoliLottie'

export default HoliLottie
