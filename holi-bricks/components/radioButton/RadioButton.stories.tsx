import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { RadioButton } from 'holi-bricks/components/radioButton/RadioButton'
import { Stack } from 'holi-bricks/components/stack'
import { Selector } from 'holi-bricks/components/selectors'
import { SelectableRadioButton } from 'holi-bricks/components/selectors/Selectable'

const meta: Meta<typeof RadioButton> = {
  title: 'Components/RadioButton/RadioButton',
  component: RadioButton,
  argTypes: {
    label: { description: 'Label text', required: false },
  },
  args: {
    label: 'Label',
  },
}

type Story = StoryObj<typeof RadioButton>

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
        <RadioButton {...args} onPress={handlePress} />
      </Stack>
    )
  },
}

export const BySelectionState: Story = {
  render: function Render(args) {
    return (
      <Stack direction="column" gap="xxs" width="100%" padding="md">
        {[true, false].map((selected, index) => (
          <RadioButton key={index} {...args} selected={selected} label={selected ? 'Selected' : 'Unselected'} />
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
          <RadioButton
            key={index}
            {...args}
            selected={selected}
            disabled={true}
            label={selected ? 'Selected' : 'Unselected'}
          />
        ))}
      </Stack>
    )
  },
}

export const RadioButtonGroup: Story = {
  render: function Render() {
    return (
      <Selector role="radiogroup" title="Choose an option" initiallySelectedOptions={['A']}>
        <SelectableRadioButton id="A" label="Option A" />
        <SelectableRadioButton id="B" label="Option B" />
        <SelectableRadioButton id="C" label="Option C" />
      </Selector>
    )
  },
}

export default meta
