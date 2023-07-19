import { ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'

import HoliSwitch, { HoliSwitchProps, HoliSwitchSizes } from '@holi/ui/components/molecules/HoliSwitch'
import { colors } from '@holi/ui/styles/globalVars'

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

export const HoliSwitchColors = [
  colors.brandColorA10,
  colors.brandColorA20,
  colors.brandColorA30,
  colors.brandColorB10,
  colors.brandColorB20,
  colors.brandColorB30,
  colors.brandColorC10,
  colors.brandColorC20,
  colors.brandColorC30,
  colors.brandColorD10,
  colors.brandColorD20,
  colors.brandColorD30,
  colors.white100,
] as const

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
      backgroundColorOn={args.backgroundColorOn}
      backgroundColorOff={args.backgroundColorOff}
      circleColorOn={args.circleColorOn}
      circleColorOff={args.circleColorOff}
      border={args.border}
      borderColor={args.borderColor}
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
  backgroundColorOn: {
    description: 'background color when switch is on',
    control: { type: 'select', options: HoliSwitchColors },
  },
  backgroundColorOff: {
    description: 'background color when switch is off',
    control: { type: 'select', options: HoliSwitchColors },
  },
  circleColorOn: {
    description: 'circle color when switch is on',
    control: { type: 'select', options: HoliSwitchColors },
  },
  circleColorOff: {
    description: 'circle color when switch is off',
    control: { type: 'select', options: HoliSwitchColors },
  },
  border: { description: 'adds a border to the switch' },
  borderColor: { description: 'border color', control: { type: 'select', options: HoliSwitchColors } },
}

Primary.args = {
  size: 'default',
  disabled: false,
  switchOn: false,
  duration: 300,
  backgroundColorOn: colors.brandColorA30,
  backgroundColorOff: colors.brandColorB30,
  circleColorOn: colors.brandColorB30,
  circleColorOff: colors.brandColorA30,
  border: false,
  borderColor: colors.brandColorB30,
}
