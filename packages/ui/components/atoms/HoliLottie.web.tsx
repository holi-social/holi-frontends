import Dynamic from 'next/dynamic'
import React from 'react'

// eslint-disable-next-line no-restricted-imports
import { animations } from '../../lottie-animations'

const Lottie = Dynamic(() => import('lottie-react'), { ssr: false })

interface HoliLottieProps {
  animType: keyof typeof animations
}

const HoliLottie: React.VFC<HoliLottieProps> = ({ animType }) => {
  return <Lottie animationData={animations[animType]} />
}

export default HoliLottie
