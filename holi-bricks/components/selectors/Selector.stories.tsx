import type { Meta, StoryObj } from '@storybook/react'
import { Selector } from 'holi-bricks/components/selectors/Selector'
import React from 'react'

import { Chat3, Megaphone, OpenArm, StarRounded } from '@holi/icons/src/generated'

import { SelectableCard, SelectableChip } from './Selectable'

const meta: Meta<typeof Selector> = {
  title: 'Components/Selectors/Selector',
  component: Selector,
  argTypes: {
    children: { table: { disable: true } },
    onSelect: { table: { disable: true } },
    onChange: { table: { disable: true } },
    initiallySelectedOptions: { table: { disable: true } },
  },
}

type Story = StoryObj<typeof Selector>

const disabledProps = [
  'accessible',
  'id',
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-disabled',
  'tabIndex',
  'children',
  'onSelect',
  'onChange',
]

export const SelectorCards: Story = {
  argTypes: {
    inputType: { control: 'select', options: ['radio', 'checkbox', 'switch', 'none'] },
    row: { control: 'boolean' },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
  },
  args: {
    title: 'What would you like to share?',
    inputType: 'radio',
    row: false,
    initiallySelectedOptions: ['1'],
  },
  render: (args) => (
    <Selector {...args}>
      <SelectableCard title="Topic for conversation" icon={Chat3} id="1" />
      <SelectableCard title="Personal experience" icon={OpenArm} id="2" />
      <SelectableCard title="Recommendation" icon={StarRounded} id="3" />
      <SelectableCard title="Generate support for..." icon={Megaphone} id="4" />
    </Selector>
  ),
}

export const Chips: Story = {
  args: {
    title: 'Chips with radio logic (only one can be selected):',
    inputType: 'radio',
    row: true,
  },
  render: (args) => (
    <Selector {...args}>
      <SelectableChip id="1" color="purple">
        Chip 1
      </SelectableChip>
      <SelectableChip id="2" color="red">
        Chip 2
      </SelectableChip>
      <SelectableChip id="3" color="orange">
        Chip 3
      </SelectableChip>
      <SelectableChip id="4" color="yellow">
        Chip 4
      </SelectableChip>
    </Selector>
  ),
}

export const ChipsMultipleSelection: Story = {
  args: {
    title: 'Chips with check logic (0-n can be selected):',
    inputType: 'checkbox',
    row: true,
  },
  render: function Render(args) {
    return (
      <Selector {...args}>
        <SelectableChip id="1" color="purple">
          Chip 1
        </SelectableChip>
        <SelectableChip id="2" color="red">
          Chip 2
        </SelectableChip>
        <SelectableChip id="3" color="orange">
          Chip 3
        </SelectableChip>
        <SelectableChip id="4" color="yellow">
          Chip 4
        </SelectableChip>
      </Selector>
    )
  },
}

export default meta
