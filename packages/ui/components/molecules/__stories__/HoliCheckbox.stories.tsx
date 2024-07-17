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
    setChecked(!isChecked || isChecked === 'mixed')
  }
  return (
    <div style={{ width: 320 }}>
      <HoliCheckbox onSelect={handleOnChange} {...args} checked={isChecked} />
    </div>
  )
}

export const Primary: ComponentStory<typeof HoliCheckbox> = Template.bind({})

Primary.argTypes = {
  label: { description: 'Label', control: { type: 'text' } },
  'aria-label': { description: 'A11y Label', control: { type: 'text' } },
  disabled: { description: 'Disables interaction', type: 'boolean', control: { type: 'boolean' } },
  errorMessage: { description: 'Error message', control: { type: 'text' } },
  shape: { description: 'Outer shape', type: 'string', control: { type: 'select' }, options: ['square', 'round'] },
  checked: { description: 'Checked state', control: { type: 'select' }, options: [true, false, 'mixed'] },
}

Primary.args = {
  label: 'Hello Checkbox',
  'aria-label': 'Hello Checkbox',
  disabled: false,
  shape: 'square',
  errorMessage: '',
  checked: false,
}
