import type { Meta, StoryObj } from '@storybook/react'
import { Colors } from 'holi-bricks/foundations'
import React from 'react'

import { Cloud, Heart } from '@holi/icons/src/generated'

import { ChipLabel } from './ChipLabel'

const availableColors = ['white' as const, ...Object.values(Colors)]
const availableSizes = ['sm', 'md', 'lg'] as const
const disabledProps = [
  'accessible',
  'id',
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-disabled',
  'tabIndex',
  'iconLeading',
]

const meta: Meta<typeof ChipLabel> = {
  title: 'Components/Chips/Chip Label',
  component: ChipLabel,
  argTypes: {
    children: { description: 'Text label', required: true },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
  },
  args: {
    children: 'Chip',
  },
}

type Story = StoryObj<typeof ChipLabel>

export const Default: Story = {
  argTypes: {
    color: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
    iconTrailing: {
      table: {
        disable: true,
      },
    },
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

export const ByIcons: Story = {
  argTypes: {
    color: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
  },
  args: {
    color: Colors.yellow,
    size: 'md',
  },
  render: function Render(args) {
    return (
      <>
        <ChipLabel {...args} />
        <ChipLabel {...args} iconLeading={Cloud} />
        <ChipLabel {...args} iconTrailing={Cloud} />
        <ChipLabel {...args} iconLeading={Cloud} iconTrailing={Heart} />
        <ChipLabel {...{ ...args, ...{ children: undefined } }} iconLeading={Cloud} />
      </>
    )
  },
}

export default meta
