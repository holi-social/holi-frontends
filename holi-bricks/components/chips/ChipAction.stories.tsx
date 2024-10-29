import { action } from '@storybook/addon-actions'
import { useArgs } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'
import { Colors } from 'holi-bricks/tokens'
import React from 'react'

import { Hearts, Pencil } from '@holi/icons/src/generated'

import { ChipAction } from './ChipAction'

const availableColors = ['white' as const, ...Object.values(Colors)]
const availableSizes = ['sm', 'md', 'lg'] as const

const meta: Meta<typeof ChipAction> = {
  title: 'Components/Chips/Chip Action',
  component: ChipAction,
  argTypes: {
    children: { description: 'Text label', required: true },
  },
  args: {
    children: 'Chip',
    disabled: false,
    selected: false,
  },
}

type Story = StoryObj<typeof ChipAction>

export const Playground: Story = {
  argTypes: {
    color: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
    iconLeading: {
      table: {
        disable: true,
      },
    },
    iconTrailing: {
      table: {
        disable: true,
      },
    },
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

    return <ChipAction {...args} onPress={handleOnPress} selected={selected} />
  },
}

export const ByColor: Story = {
  args: {
    iconTrailing: Pencil,
  },
  render: function Render(args) {
    return (
      <>
        {availableColors.map((c) => (
          <ChipAction key={c} {...args} color={c} />
        ))}
      </>
    )
  },
}

export const BySize: Story = {
  args: {
    iconTrailing: Pencil,
  },
  render: function Render(args) {
    return (
      <>
        {availableSizes.map((s) => (
          <ChipAction key={s} {...args} size={s} color="blue" />
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
        <ChipAction {...args} />
        <ChipAction {...args} iconLeading={Hearts} />
        <ChipAction {...args} iconTrailing={Pencil} />
        <ChipAction {...args} iconLeading={Hearts} iconTrailing={Pencil} />
        <ChipAction {...{ ...args, ...{ children: undefined } }} iconLeading={Hearts} />
      </>
    )
  },
}

export default meta
