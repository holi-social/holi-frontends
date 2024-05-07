import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'

import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalSelect, {
  HoliModalSelectOption,
  HoliModalSelectVariants,
} from '@holi/ui/components/organisms/HoliModalSelect'

const defaultOptions = [
  {
    id: 'PUBLIC',
    title: 'Public',
    description: 'Just collaborators can contact you regarding this task.',
    selected: false,
  },
  {
    id: 'MEMBERS',
    title: 'Members',
    description: 'This task is publicly visible. Anyone can contact you regarding this task.',
    selected: false,
  },
]

export default {
  title: 'Organisms/HoliModalSelect',
  component: HoliModalSelect,
} as ComponentMeta<typeof HoliModalSelect>

const Template: ComponentStory<typeof HoliModalSelect> = (props) => {
  const [options, setOptions] = useState(defaultOptions)
  const { show, hide, visible } = useModalState()
  const onChange = (option: HoliModalSelectOption) =>
    setOptions(options.map((currentOption) => ({ ...currentOption, selected: currentOption.id === option.id })))
  return <HoliModalSelect {...props} options={options} onChange={onChange} show={show} hide={hide} visible={visible} />
}

export const Example: ComponentStory<typeof HoliModalSelect> = Template.bind({})

Example.argTypes = {
  label: { description: 'Button label', required: true },
  title: { description: 'Modal header title', required: true },
  description: { description: 'Modal header description', required: false },
  placeholder: { description: 'Modal button placeholder', required: false },
  isRequired: { description: 'Boolean to set this form field as required', required: false },
  options: { description: 'Select options', required: true, control: { type: 'object' } },
  variant: {
    options: HoliModalSelectVariants,
    control: { type: 'select' },
    description: 'normal or dense',
  },
  showOptionIcon: { description: 'Display selected option icon along with the name', required: false },
}

Example.args = {
  label: 'Holi modal select',
  title: 'Holi modal select',
  description: 'Description...',
  placeholder: 'Select one...',
  isRequired: false,
  options: defaultOptions,
  variant: 'normal',
  showOptionIcon: true,
}
