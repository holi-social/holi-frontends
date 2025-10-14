import Dynamic from 'next/dynamic'
import type React from 'react'

// eslint-disable-next-line no-restricted-imports
import { animations } from '../../lottie-animations'
import type { HoliLottieHandle } from '@holi/ui/components/atoms/HoliLottie'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { LottieRefCurrentProps } from 'lottie-react'

const Lottie = Dynamic(() => import('lottie-react'), { ssr: false })

const HoliLottie = forwardRef<
  HoliLottieHandle,
  { animType: keyof typeof animations; loop?: boolean; autoplay?: boolean }
>(({ animType, loop = true, autoplay = false }, ref) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  useImperativeHandle(ref, () => ({
    play: () => lottieRef.current?.playSegments([0, 478], true),
    pause: () => lottieRef.current?.pause(),
    reset: () => lottieRef.current?.stop(),
  }))

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animations[animType]}
      loop={loop}
      autoPlay={autoplay}
      initialSegment={[175, 180]}
    />
  )
})

HoliLottie.displayName = 'HoliLottie'

export default HoliLottie
