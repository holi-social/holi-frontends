import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { animations } from '@holi/ui/lottie-animations'

export default {
  title: 'Atoms/HoliLottie',
  parameters: {
    docs: {
      description: {
        component: 'HoliLottie - Lottie animation component.',
      },
    },
  },
} as ComponentMeta<typeof HoliLottie>

export const Primary: ComponentStory<typeof HoliLottie> = ({ animType }: { animType: keyof typeof animations }) => (
  <div className="lottie-container">
    <HoliLottie animType={animType} />
  </div>
)

Primary.args = {
  animType: 'loader',
}

Primary.argTypes = {
  animType: {
    description: `Animation type: ${Object.keys(animations)
      .map((key) => `"${key}"`)
      .join(' | ')}`,
  },
}
