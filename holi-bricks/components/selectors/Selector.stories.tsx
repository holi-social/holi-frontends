import { Meta, StoryObj } from '@storybook/react'
import { Selector } from 'holi-bricks/components/selectors/Selector'
import { SelectorCard } from 'holi-bricks/components/selectors/SelectorCard'
import React from 'react'

// eslint-disable-next-line no-restricted-imports
import { Chat3, Megaphone, OpenArm, StarRounded } from '@holi/icons/src/generated'
// TODO: move ChipAction to holi-bricks
// eslint-disable-next-line no-restricted-imports
import ChipAction from '@holi/ui/no-name/components/chips/ChipAction'

const meta: Meta<typeof Selector> = {
  title: 'Components/Selectors/Selector',
  component: Selector,
}

type Story = StoryObj<typeof Selector>

export const SelectorCards: Story = {
  argTypes: {
    title: { control: 'text' },
    inputType: { control: 'select', options: ['radio', 'checkbox', 'switch', 'none'] },
    row: { control: 'boolean' },
  },
  args: {
    title: 'What would you like to share?',
    inputType: 'radio',
    row: false,
    initiallySelectedOptions: ['1'],
  },
  render: function Render(args) {
    return (
      <Selector {...args}>
        <SelectorCard title={'Topic for conversation'} icon={Chat3} id="1" />
        <SelectorCard title={'Personal experience'} icon={OpenArm} id="2" />
        <SelectorCard title={'Recommendation'} icon={StarRounded} id="3" />
        <SelectorCard title={'Generate support for...'} icon={Megaphone} id="4" />
      </Selector>
    )
  },
}

export const ChipsSingleSelection: Story = {
  argTypes: {
    title: { control: 'text' },
    inputType: { control: 'select', options: ['radio', 'checkbox', 'switch', 'none'] },
    row: { control: 'boolean' },
  },
  args: {
    title: 'Chips with radio logic (only one can be selected):',
    inputType: 'radio',
    row: true,
  },
  render: function Render(args) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleOnPress = () => {}
    return (
      <Selector {...args} onSelect={handleOnPress}>
        <ChipAction id="chip1" color="purple" onPress={handleOnPress}>
          Chip 1
        </ChipAction>
        <ChipAction id="chip2" color="red" onPress={handleOnPress}>
          Chip 2
        </ChipAction>
        <ChipAction id="chip3" color="orange" onPress={handleOnPress}>
          Chip 3
        </ChipAction>
        <ChipAction id="chip4" color="yellow" onPress={handleOnPress}>
          Chip 4
        </ChipAction>
      </Selector>
    )
  },
}

export const ChipsMultipleSelection: Story = {
  argTypes: {
    title: { control: 'text' },
    inputType: { control: 'select', options: ['radio', 'checkbox', 'switch', 'none'] },
    row: { control: 'boolean' },
  },
  args: {
    title: 'Chips with check logic (0-n can be selected):',
    row: true,
  },
  render: function Render(args) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleOnPress = () => {}
    return (
      <Selector {...args} onSelect={handleOnPress}>
        <ChipAction id="chip1" color="purple" onPress={handleOnPress}>
          Chip 1
        </ChipAction>
        <ChipAction id="chip2" color="red" onPress={handleOnPress}>
          Chip 2
        </ChipAction>
        <ChipAction id="chip3" color="orange" onPress={handleOnPress}>
          Chip 3
        </ChipAction>
        <ChipAction id="chip4" color="yellow" onPress={handleOnPress}>
          Chip 4
        </ChipAction>
      </Selector>
    )
  },
}

export default meta
