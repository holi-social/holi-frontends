import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { Checkbox } from 'holi-bricks/components/checkbox/Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox/Checkbox',
  component: Checkbox,
  argTypes: {
    label: { description: 'Label text', required: false },
    selected: { description: 'Selected state', control: { type: 'select' }, options: [true, false, 'indeterminate'] },
  },
  args: {
    label: 'Label',
  },
}

type Story = StoryObj<typeof Checkbox>

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
        <Checkbox {...args} onPress={handlePress} />
      </Stack>
    )
  },
}

export const BySelectionState: Story = {
  render: function Render(args) {
    return (
      <Stack direction="column" gap="xxs" width="100%" padding="md">
        {[true, false, 'indeterminate'].map((selected, index) => (
          <Checkbox
            key={index}
            {...args}
            selected={selected as boolean | 'indeterminate'}
            label={selected === 'indeterminate' ? 'indeterminate' : selected ? 'Selected' : 'Unselected'}
          />
        ))}
      </Stack>
    )
  },
}

export const DisabledBySelectionState: Story = {
  render: function Render(args) {
    return (
      <Stack direction="column" gap="xxs" width="100%" padding="md">
        {[true, false, 'indeterminate'].map((selected, index) => (
          <Checkbox
            key={index}
            {...args}
            selected={selected as boolean | 'indeterminate'}
            disabled
            label={selected === 'indeterminate' ? 'indeterminate' : selected ? 'Selected' : 'Unselected'}
          />
        ))}
      </Stack>
    )
  },
}

export const CheckboxGroup: Story = {
  render: function Render() {
    const [selected, setSelected] = useState({
      a: false,
      b: false,
      c: false,
    })

    const handlePress = (key: keyof typeof selected) => {
      setSelected((prev) => ({ ...prev, [key]: !prev[key] }))
    }
    return (
      <Stack direction="column" gap="xxs" width="100%" padding="md">
        <Checkbox label="Option A" onPress={() => handlePress('a')} selected={selected.a} />
        <Checkbox label="Option B" onPress={() => handlePress('b')} selected={selected.b} />
        <Checkbox label="Option C" onPress={() => handlePress('c')} selected={selected.c} />
      </Stack>
    )
  },
}

export default meta
