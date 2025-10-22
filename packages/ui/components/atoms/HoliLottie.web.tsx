import Dynamic from 'next/dynamic'
import type React from 'react'

// eslint-disable-next-line no-restricted-imports
import { animations } from '../../lottie-animations'

const Lottie = Dynamic(() => import('lottie-react'), { ssr: false })

interface HoliLottieProps {
  animType: keyof typeof animations
  loop?: boolean
}

const HoliLottie = ({ animType, loop = true }: HoliLottieProps) => {
  return <Lottie animationData={animations[animType]} loop={loop} />
}

export default HoliLottie
