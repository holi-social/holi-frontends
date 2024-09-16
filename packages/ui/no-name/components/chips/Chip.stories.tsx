import { action } from '@storybook/addon-actions'
import { useArgs } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Hearts, Pencil } from '@holi/icons/src/generated'
import { Colors } from '@holi/ui/no-name/foundations/colors/primitives'

import Chip from './Chip'

const availableColors = ['white' as const, ...Object.values(Colors)]
const availableSizes = ['md', 'lg'] as const

const meta: Meta<typeof Chip> = {
  title: 'No Name/Components/Chips (draft)',
  component: Chip,
  argTypes: {
    children: { description: 'Text label', required: true },
  },
  args: {
    children: 'Chip',
    disabled: false,
    selected: false,
  },
}

type Story = StoryObj<typeof Chip>

export const Playground: Story = {
  argTypes: {
    color: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
    iconLeading: { control: { type: false } },
    iconTrailing: { control: { type: false } },
  },
  args: {
    color: Colors.green,
    onPress: action('Pressed!'),
    size: 'md',
    iconTrailing: Pencil,
  },
  render: function Render(args) {
    const [{ selected }, updateArgs] = useArgs()

    const handleOnPress = () => {
      updateArgs({ selected: !selected })
    }

    return <Chip {...args} onPress={handleOnPress} selected={selected} />
  },
}

export const ByColor: Story = {
  args: {
    iconTrailing: Pencil,
  },
  render: function Render(args) {
    return (
      <div style={{ display: 'flex', gap: 10 }}>
        {availableColors.map((c) => (
          <Chip key={c} {...args} color={c} />
        ))}
      </div>
    )
  },
}

export const BySize: Story = {
  args: {
    iconTrailing: Pencil,
  },
  render: function Render(args) {
    return (
      <div style={{ display: 'flex', alignItems: 'end', gap: 10 }}>
        {availableSizes.map((s) => (
          <Chip key={s} {...args} size={s} color="blue" />
        ))}
      </div>
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
      <div style={{ display: 'flex', gap: 10 }}>
        <Chip {...args} />
        <Chip {...args} iconLeading={Hearts} />
        <Chip {...args} iconTrailing={Pencil} />
        <Chip {...args} iconLeading={Hearts} iconTrailing={Pencil} />
        <Chip {...{ ...args, ...{ children: undefined } }} iconLeading={Hearts} />
      </div>
    )
  },
}

export default meta
