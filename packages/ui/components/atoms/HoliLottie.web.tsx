import Lottie from 'lottie-react'
import React from 'react'

import { animations } from '@holi/ui/lottie-animations'

interface Props {
  animType: keyof typeof animations
  loop?: boolean
}

const HoliLottie = ({ animType, loop }: Props) => <Lottie loop={loop} animationData={animations[animType]} />

export default HoliLottie
