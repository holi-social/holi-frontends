import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'

import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'

export default {
  title: 'Molecules/HoliCheckbox',
  component: HoliCheckbox,
} as ComponentMeta<typeof HoliCheckbox>

const Template: ComponentStory<typeof HoliCheckbox> = ({ ...args }) => {
  const [isChecked, setChecked] = useState(args.checked)

  const handleOnChange = () => {
    setChecked(!isChecked)
  }
  return <HoliCheckbox onSelect={handleOnChange} {...args} />
}

export const Primary: ComponentStory<typeof HoliCheckbox> = Template.bind({})

Primary.argTypes = {
  label: { description: 'Label', control: { type: 'text' } },
  disabled: { description: 'Disables interaction', type: 'boolean', control: { type: 'boolean' } },
  hasError: { description: 'Shows failing validation', type: 'boolean', control: { type: 'boolean' } },
  shape: { description: 'Outer shape', type: 'string', control: { type: 'select', options: ['square', 'round'] } },
}

Primary.args = {
  label: 'Hello Checkbox',
  disabled: false,
  shape: 'square',
  hasError: false,
}
