import { useArgs } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import HoliBadge from '@holi/ui/components/molecules/HoliBadge'
import { colors } from '@holi/ui/styles/globalVars'

export default {
  title: 'Molecules/HoliBadge',
  component: HoliBadge,
} as Meta<typeof HoliBadge>

const holiTextColorOptions = ['black300', 'error200', 'gray200', 'gray300', 'white100', 'white200', 'brandB300']

export const Example: StoryObj<typeof HoliBadge> = {
  argTypes: {
    color: { type: 'string', control: { type: 'select' }, options: holiTextColorOptions },
    backgroundColor: { type: 'string', control: 'color' },
  },
  args: {
    color: 'gray300',
    backgroundColor: colors.white200,
  },
  render: function Render() {
    const [{ color, backgroundColor }] = useArgs()

    return (
      <HoliBadge color={color} backgroundColor={backgroundColor}>
        This is a badge
      </HoliBadge>
    )
  },
}
