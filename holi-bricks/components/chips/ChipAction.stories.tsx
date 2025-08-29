import { action } from '@storybook/addon-actions'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Colors } from 'holi-bricks/foundations'
import React from 'react'

import { Hearts, Pencil } from '@holi/icons/src/generated'

import { ChipAction } from './ChipAction'
import { controlWithLabel } from 'holi-bricks/storybook/icons-to-story'
import { Stack } from 'holi-bricks/components/stack'
import { accessibilityAttributes } from 'holi-bricks/foundations/accessibility'

const availableColors = ['white' as const, ...Object.values(Colors)]
const availableSizes = ['sm', 'md', 'lg'] as const
const disabledProps = [...accessibilityAttributes, 'id', 'onPress', 'testID']

const meta: Meta<typeof ChipAction> = {
  title: 'Components/Chips/Chip Action',
  component: ChipAction,
  argTypes: {
    children: { description: 'Text label', required: true },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    iconTrailing: { ...controlWithLabel },
    iconLeading: { ...controlWithLabel },
  },
  args: {
    children: 'Chip',
    disabled: false,
    selected: false,
  },
}

type Story = StoryObj<typeof ChipAction>

export const Default: Story = {
  argTypes: {
    color: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
  },
  args: {
    color: Colors.green,
    onPress: action('Pressed!'),
    size: 'md',
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
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        {availableColors.map((c) => (
          <ChipAction key={c} {...args} color={c} />
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
          <ChipAction key={s} {...args} size={s} color="blue" />
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
        <ChipAction {...args} />
        <ChipAction {...args} iconLeading={Hearts} />
        <ChipAction {...args} iconTrailing={Pencil} />
        <ChipAction {...args} iconLeading={Hearts} iconTrailing={Pencil} />
        <ChipAction {...{ ...args, ...{ children: undefined } }} iconLeading={Hearts} />
      </Stack>
    )
  },
}

export default meta
