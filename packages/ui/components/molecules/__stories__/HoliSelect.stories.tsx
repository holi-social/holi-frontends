import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'

import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

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

const initialOptions: HoliSelectOption[] = [
  {
    id: '1',
    title: 'Animal Welfare',
    selected: false,
  },
  {
    id: '2',
    title: 'Children & Youth',
    selected: false,
  },
  {
    id: '3',
    title: 'Climate Protection',
    selected: false,
  },
  {
    id: '4',
    title: 'Corona',
    selected: false,
  },
  {
    id: '5',
    title: 'Culture & History',
    selected: false,
  },
  {
    id: '6',
    title: 'Development Cooperation',
    selected: false,
  },
  {
    id: '7',
    title: 'Digitalization',
    selected: false,
  },
  {
    id: '8',
    title: 'Disaster Protection',
    selected: false,
  },
]

const args = {
  inputLabel: 'Label',
  accessibilityLabel: 'Accessibility label',
  placeholder: 'Nothing selected',
  options: initialOptions,
}
const argTypes = {
  inputLabel: { description: 'Label', required: true, control: { type: 'text' } },
  accessibilityLabel: { description: 'Accessibility Label', required: true, control: { type: 'text' } },
  placeholder: { description: 'Placeholder', control: { type: 'text' } },
  options: { description: 'Options', control: { type: 'object' } },
}

export const SingleSelect: ComponentStory<typeof HoliSelect> = ({ ...args }) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>()

  const toggleOptionSelect = (topic: HoliSelectOption) => {
    if (selectedOption === topic.id) {
      setSelectedOption(undefined)
    } else {
      setSelectedOption(topic.id)
    }
  }

  return (
    <HoliSelect
      {...args}
      options={initialOptions.map((option) => ({ ...option, selected: option.id === selectedOption }))}
      onChange={toggleOptionSelect}
    />
  )
}
SingleSelect.args = args
SingleSelect.argTypes = argTypes

export const MultiSelect: ComponentStory<typeof HoliSelect> = ({ ...args }) => {
  const [options, setOptions] = useState<HoliSelectOption[]>(initialOptions)

  const toggleOptionSelection = (topic: HoliSelectOption) => {
    setOptions((options) =>
      options.map((option) => (option.id === topic.id ? { ...option, selected: !option.selected } : option))
    )
  }

  return <HoliSelect {...args} options={options} onChange={toggleOptionSelection} />
}

MultiSelect.args = args
MultiSelect.argTypes = argTypes
