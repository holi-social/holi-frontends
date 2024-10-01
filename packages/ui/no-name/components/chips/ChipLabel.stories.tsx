import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Cloud } from '@holi/icons/src/generated'
import { Colors } from '@holi/ui/no-name/foundations/colors/primitives'

import ChipLabel from './ChipLabel'

const availableColors = ['white' as const, ...Object.values(Colors)]
const availableSizes = ['sm', 'md', 'lg'] as const

const meta: Meta<typeof ChipLabel> = {
  title: 'No Name/Components/Chips (draft)/Chip Label',
  component: ChipLabel,
  argTypes: {
    children: { description: 'Text label', required: true },
  },
  args: {
    children: 'Chip',
  },
}

type Story = StoryObj<typeof ChipLabel>

export const Playground: Story = {
  argTypes: {
    color: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
    iconTrailing: { control: { type: false } },
  },
  args: {
    color: Colors.yellow,
    size: 'md',
    iconTrailing: Cloud,
  },
}

export const ByColor: Story = {
  args: {
    iconLeading: Cloud,
  },
  render: function Render(args) {
    return (
      <>
        {availableColors.map((c) => (
          <ChipLabel key={c} {...args} color={c} />
        ))}
      </>
    )
  },
}

export const BySize: Story = {
  args: {
    iconLeading: Cloud,
  },
  render: function Render(args) {
    return (
      <>
        {availableSizes.map((s) => (
          <ChipLabel key={s} {...args} size={s} color="green" />
        ))}
      </>
    )
  },
}

export default meta
