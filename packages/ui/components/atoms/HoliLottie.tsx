import LottieView from 'lottie-react-native'
import React from 'react'

import { animations } from '@holi/ui/lottie-animations'

interface HoliLottieProps {
  animType: keyof typeof animations
  loop?: boolean
}

const HoliLottie = ({ animType, loop }: HoliLottieProps) => (
  <LottieView autoPlay loop={loop} source={animations[animType]} />
)

export default HoliLottie
