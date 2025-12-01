import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { Switch } from 'holi-bricks/components/switch/Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch/Switch',
  component: Switch,
  argTypes: {
    label: { description: 'Label text', required: false },
  },
  args: {
    label: 'Label',
  },
}

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  argTypes: {
    label: { description: 'Label text', required: false },
  },
  args: {
    label: 'Label',
    disabled: false,
    selected: false,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const handlePress = () => {
      updateArgs({ selected: !args.selected })
    }
    return (
      <Stack width="100%" padding="md">
        <Switch {...args} onPress={handlePress} />
      </Stack>
    )
  },
}

export const BySelectionState: Story = {
  render: function Render(args) {
    return (
      <Stack direction="column" gap="xxs" width="100%" padding="md">
        {[true, false].map((selected, index) => (
          <Switch key={index} {...args} selected={selected} label={selected ? 'Selected' : 'Unselected'} />
        ))}
      </Stack>
    )
  },
}

export const DisabledBySelectionState: Story = {
  render: function Render(args) {
    return (
      <Stack direction="column" gap="xxs" width="100%" padding="md">
        {[true, false].map((selected, index) => (
          <Switch key={index} {...args} selected={selected} disabled label={selected ? 'Selected' : 'Unselected'} />
        ))}
      </Stack>
    )
  },
}

export default meta
