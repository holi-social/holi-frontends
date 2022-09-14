import LottieView from 'lottie-react-native'
import React from 'react'

// eslint-disable-next-line no-restricted-imports
import { animations } from '../../lottie-animations'

interface HoliLottieProps {
  animType: keyof typeof animations
}

const HoliLottie: React.VFC<HoliLottieProps> = ({ animType }) => <LottieView autoPlay source={animations[animType]} />

export default HoliLottie
