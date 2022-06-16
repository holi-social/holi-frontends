import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'

import HoliChip from '@holi/ui/components/HoliChip'

export default {
  title: 'Components/HoliChip',
  component: HoliChip,
} as ComponentMeta<typeof HoliChip>

const Template: ComponentStory<typeof HoliChip> = ({ ...args }) => {
  const [checked, setChecked] = useState(false)

  const handleOnChange = () => {
    setChecked(!checked)
  }
  return <HoliChip onPress={handleOnChange} checked={checked} {...args} />
}

export const Primary: ComponentStory<typeof HoliChip> = Template.bind({})

Primary.argTypes = {
  text: { description: 'Text', required: true, control: { type: 'text' } },
  label: { description: 'Accessibility Label', control: { type: 'text' } },
  disabled: { description: 'Disables interaction', type: 'boolean', control: { type: 'boolean' } },
  checked: { description: 'Checked or unchecked state', type: 'boolean', control: { type: 'boolean' } },
}

Primary.args = {
  text: 'Chip',
  label: 'Label',
  disabled: false,
}
