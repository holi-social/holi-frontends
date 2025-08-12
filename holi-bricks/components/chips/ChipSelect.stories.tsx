import { action } from '@storybook/addon-actions'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Colors } from 'holi-bricks/foundations'
import React from 'react'

import { ChipSelect, type ChipSelectColor } from './ChipSelect'
import { Stack } from 'holi-bricks/components/stack'
import { accessibilityAttributes } from 'holi-bricks/foundations/accessibility'

const availableColors = [...Object.values(Colors), 'yellowLight' as ChipSelectColor]
const availableSizes = ['md', 'lg'] as const
const disabledProps = [...accessibilityAttributes, 'id', 'onPress', 'testID', 'avatar']

const meta: Meta<typeof ChipSelect> = {
  title: 'Components/Chips/Chip Select',
  component: ChipSelect,
  argTypes: {
    children: { description: 'Text label', required: true },
    avatar: {
      type: 'string',
      options: ['none', 'initials', 'image'],
      control: { type: 'select' },
      mapping: {
        none: undefined,
        initials: { initials: 'TP', label: 'pick me' },
        image: {
          initials: 'TP',
          label: 'no, pick me',
          imageSrc: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg',
        },
      },
    },
    counter: {
      type: 'string',
      description: 'Optional counter',
    },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
  },
  args: {
    children: 'Chip',
    counter: '',
    disabled: false,
    selected: false,
  },
}

type Story = StoryObj<typeof ChipSelect>

export const Default: Story = {
  argTypes: {
    selectedColor: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
  },
  args: {
    selectedColor: Colors.green,
    onPress: action('Pressed!'),
    size: 'md',
  },
  render: function Render(args) {
    const [{ selected }, updateArgs] = useArgs()

    const handleOnPress = () => {
      updateArgs({ selected: !selected })
    }

    return <ChipSelect {...args} onPress={handleOnPress} selected={selected} />
  },
}

export const ByColor: Story = {
  args: {
    selected: true,
  },
  render: function Render(args) {
    return (
      <Stack gap="xxs" direction="row">
        {availableColors.map((c) => (
          <ChipSelect key={c} {...args} selectedColor={c} />
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
          <ChipSelect key={s} {...args} size={s} selectedColor="blue" />
        ))}
      </Stack>
    )
  },
}

export const BySelection: Story = {
  argTypes: {
    selectedColor: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
    selected: { control: false },
  },
  args: {
    selectedColor: Colors.green,
    size: 'md',
  },
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        <ChipSelect {...args} />
        <ChipSelect {...args} selected />
      </Stack>
    )
  },
}

export const ByAvatar: Story = {
  argTypes: {
    selectedColor: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
    avatar: { control: false },
  },
  args: {
    selectedColor: Colors.green,
    size: 'md',
  },
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        <ChipSelect {...args} />
        <ChipSelect {...args} avatar={{ initials: 'TP', label: 'pick me' }} />
        <ChipSelect
          {...args}
          avatar={{
            initials: 'TP',
            label: 'pick me',
            source: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
          }}
        />
      </Stack>
    )
  },
}

export const ByCounter: Story = {
  argTypes: {
    selectedColor: { control: 'select', options: availableColors },
    size: { control: 'select', options: availableSizes },
    avatar: { control: false },
  },
  args: {
    selectedColor: 'yellowLight',
    size: 'md',
    selected: true,
  },
  render: function Render(args) {
    return (
      <>
        <ChipSelect {...args} />
        <ChipSelect {...args} counter="42" />
        <ChipSelect {...args} counter="999" selected={false} />
      </>
    )
  },
}

export default meta
