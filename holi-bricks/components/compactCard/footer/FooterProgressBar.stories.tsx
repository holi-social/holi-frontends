/* eslint-disable no-restricted-imports */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { CompactCard } from 'holi-bricks/components/compactCard/CompactCard'
import { FooterProgressBar } from 'holi-bricks/components/compactCard/footer/FooterProgressBar'
import { Stack } from 'holi-bricks/components/stack'

const meta: Meta<typeof FooterProgressBar> = {
  title: 'Components/Card/CompactCard/Footer/FooterProgressBar',
  component: FooterProgressBar,
  args: {
    progressBarLeft: '23% funded',
    progressBarRight: '€ 233,00 to go',
    progressBarPercentage: 23,
  },
}

type Story = StoryObj<typeof FooterProgressBar>

export const Default: Story = {
  render: function Render(args) {
    return (
      <Stack width={200}>
        <CompactCard.FooterProgressBar {...args} />
      </Stack>
    )
  },
}

export default meta
