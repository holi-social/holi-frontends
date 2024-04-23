import Lottie from 'lottie-react'
import React from 'react'

// eslint-disable-next-line no-restricted-imports
import { animations } from '../../lottie-animations'

interface HoliLottieProps {
  animType: keyof typeof animations
}

const HoliLottie: React.VFC<HoliLottieProps> = ({ animType }) => {
  return <Lottie animationData={animations[animType]} />
}

export default HoliLottie
