/* eslint-disable no-restricted-imports */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { CompactCard } from 'holi-bricks/components/card/CompactCard'
import { MapPin2Filled, Chat3 } from '@holi/icons/src/generated'
import { ChipLabel } from 'holi-bricks/components/chips'

const disabledProps = [
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-disabled',
  'topLabelIcon',
  'bottomLabelIcon',
]

const meta: Meta<typeof CompactCard> = {
  title: 'Components/CompactCard',
  component: CompactCard,
  argTypes: {
    title: { description: 'Title of the card', required: true },
    subtitle: { description: 'Subtitle of the card', required: false },
    topLabel: { description: 'Top label of the card', required: false },
    bottomLabel: { description: 'Bottom label of the card', required: false },
    chips: { description: 'Chips of the card', required: false },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
  },
  args: {
    title: 'title',
    topLabel: 'top label',
    subtitle: 'subtitle',
    chips: [
      () => (
        <ChipLabel color="mono" size="sm">
          chip label
        </ChipLabel>
      ),
    ],
    topLabelIcon: MapPin2Filled,
    bottomLabel: 'Test string',
    bottomLabelIcon: Chat3,
  },
}

type Story = StoryObj<typeof CompactCard>

export const Playground: Story = {
  args: {
    title: 'title',
    topLabel: 'top label',
    subtitle: 'subtitle',
    chips: [
      () => (
        <ChipLabel color="mono" size="sm">
          chip label
        </ChipLabel>
      ),
    ],
    topLabelIcon: MapPin2Filled,
    bottomLabel: 'Test string',
    bottomLabelIcon: Chat3,
  },
  render: function Render(args) {
    return <CompactCard {...args} />
  },
}

export default meta
