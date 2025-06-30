import type { Meta, StoryObj } from '@storybook/react'
import { Colors } from 'holi-bricks/foundations'
import React from 'react'

import { Cloud, Heart } from '@holi/icons/src/generated'

import { ChipLabel } from './ChipLabel'
import { controlWithLabel } from 'holi-bricks/storybook/icons-to-story'
import { Stack } from 'holi-bricks/components/stack'

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
  'testID',
]

const meta: Meta<typeof ChipLabel> = {
  title: 'Components/Chips/Chip Label',
  component: ChipLabel,
  argTypes: {
    children: { description: 'Text label', required: true },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    iconTrailing: { ...controlWithLabel },
    iconLeading: { ...controlWithLabel },
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
  },
  args: {
    color: Colors.yellow,
    size: 'md',
    iconTrailing: Cloud,
  },
}

export const ByColor: Story = {
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        {availableColors.map((c) => (
          <ChipLabel key={c} {...args} color={c} />
        ))}
      </Stack>
    )
  },
}

export const BySize: Story = {
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        {availableSizes.map((s) => (
          <ChipLabel key={s} {...args} size={s} color="green" />
        ))}
      </Stack>
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
      <Stack direction="row" gap="xxs">
        <ChipLabel {...args} />
        <ChipLabel {...args} iconLeading={Cloud} />
        <ChipLabel {...args} iconTrailing={Cloud} />
        <ChipLabel {...args} iconLeading={Cloud} iconTrailing={Heart} />
        <ChipLabel {...{ ...args, ...{ children: undefined } }} iconLeading={Cloud} />
      </Stack>
    )
  },
}

export default meta
