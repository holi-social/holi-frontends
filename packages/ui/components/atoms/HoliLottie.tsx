import LottieView from 'lottie-react-native'
import type React from 'react'
import { StyleSheet } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { animations } from '../../lottie-animations'

interface HoliLottieProps {
  animType: keyof typeof animations
  loop?: boolean
}

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

const HoliLottie: React.FC<HoliLottieProps> = ({ animType, loop = true }) => (
  <LottieView autoPlay loop={loop} source={animations[animType]} style={styles.view} />
)

export default HoliLottie
