import { SelectProvider } from '@mobile-reality/react-native-select-pro'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliSelect, { HoliSelectOptions } from '@holi/ui/components/molecules/HoliSelect'

export default {
  title: 'Molecules/HoliSelect',
  component: HoliSelect,
  parameters: {
    docs: {
      description: {
        component: 'HoliSelect - UI component for selection from a list of options',
      },
    },
  },
} as ComponentMeta<typeof HoliSelect>

const options: HoliSelectOptions = [
  {
    value: '1',
    label: 'Animal Welfare',
  },
  {
    value: '2',
    label: 'Children & Youth',
  },
  {
    value: '3',
    label: 'Climate Protection',
  },
  {
    value: '4',
    label: 'Corona',
  },
  {
    value: '5',
    label: 'Culture & History',
  },
  {
    value: '6',
    label: 'Development Cooperation',
  },
  {
    value: '7',
    label: 'Digitalization',
  },
  {
    value: '8',
    label: 'Disaster Protection',
  },
]

const Template: ComponentStory<typeof HoliSelect> = ({ ...args }) => {
  return (
    <SelectProvider>
      <HoliSelect {...args} />
    </SelectProvider>
  )
}

export const Primary: ComponentStory<typeof HoliSelect> = Template.bind({})

Primary.args = {
  options: options,
  inputLabel: 'Label',
  accessibilityLabel: 'Accessibility label',
  dropdownIconLabel: 'Dropdown icon label',
  placeholder: 'Nothing selected',
  clearable: true,
}
Primary.argTypes = {
  inputLabel: { description: 'Label', required: true, control: { type: 'text' } },
  accessibilityLabel: { description: 'Accessibility Label', required: true, control: { type: 'text' } },
  dropdownIconLabel: { description: 'Dropdown Icon Label', required: true, control: { type: 'text' } },
  placeholder: { description: 'Placeholder', control: { type: 'text' } },
  options: { description: 'Options', control: false },
}
