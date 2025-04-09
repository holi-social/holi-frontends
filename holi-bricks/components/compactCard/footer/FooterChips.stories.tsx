/* eslint-disable no-restricted-imports */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { CompactCard } from 'holi-bricks/components/compactCard/CompactCard'
import { FooterChips } from 'holi-bricks/components/compactCard/footer/FooterChips'
import { Chat3 } from '@holi/icons/src/generated'

const meta: Meta<typeof FooterChips> = {
  title: 'Components/CompactCard/Footer/FooterChips',
  component: FooterChips,
  args: {
    chips: [
      { color: 'blue', size: 'md', iconLeading: Chat3, children: 'Label1' },
      { color: 'blue', size: 'md', iconLeading: Chat3, children: 'Label2' },
    ],
  },
}

type Story = StoryObj<typeof FooterChips>

export const Default: Story = {
  render: function Render(args) {
    return <CompactCard.FooterChips {...args} />
  },
}

export default meta
