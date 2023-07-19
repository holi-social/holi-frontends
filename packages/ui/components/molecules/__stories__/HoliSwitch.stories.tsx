import { ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'

import HoliSwitch, { HoliSwitchProps, HoliSwitchSizes } from '@holi/ui/components/molecules/HoliSwitch'

export default {
  title: 'Molecules/HoliSwitch',
  parameters: {
    docs: {
      description: {
        component: 'Primary UI switch/toggle component.',
      },
    },
  },
} as ComponentMeta<typeof HoliSwitch>

const SwitchWithHooks = (args: HoliSwitchProps) => {
  const [on, setOn] = useState(false)
  const handleOnChange = () => {
    setOn(!on)
  }
  return (
    <HoliSwitch
      onPress={handleOnChange}
      switchOn={args.switchOn || on}
      size={args.size}
      disabled={args.disabled}
      duration={args.duration}
    />
  )
}

export const Primary = (args: HoliSwitchProps) => {
  return <SwitchWithHooks {...args} />
}

Primary.argTypes = {
  size: {
    description: 'adjusts the size of the switch',
    control: { type: 'select', options: HoliSwitchSizes },
  },
  disabled: {
    description: 'disables the switch',
  },
  onPress: { description: 'action performed when clicking the switch' },
  switchOn: { description: 'switch state' },
  duration: { description: 'animation duration' },
}

Primary.args = {
  size: 'default',
  disabled: false,
  switchOn: false,
  duration: 300,
}
