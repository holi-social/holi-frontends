import React, { useState } from 'react'

import HoliSwitch, { HoliSwitchSizes } from '@holi/ui/components/molecules/HoliSwitch'

export default {
  title: 'Molecules/HoliSwitch',
  parameters: {
    docs: {
      description: {
        component: 'Primary UI switch/toggle component.',
      },
    },
  },
}

export const Primary = ({ ...args }) => {
  const [on, setOn] = useState(false)
  const handleOnChange = () => {
    args.value = !on
    setOn(!on)
  }
  return (
    <HoliSwitch
      onChange={handleOnChange}
      value={args.value || on}
      size={args.size}
      disabled={args.disabled}
      duration={args.duration}
    />
  )
}

Primary.args = {
  size: 'medium',
  disabled: false,
  duration: 300,
}

Primary.colorChoices = [
  '#f5ef3f', // colors.brandColorA30
  '#6267e7', // colors.brandColorB30,
  '#86df54', // colors.brandColorC30,
  '#4abef0', // colors.brandColorD30,
  '#bfbebe', // colors.foreground10,
  'black',
  'white',
]

Primary.argTypes = {
  value: { description: 'true if the switch is switched on, false otherwise' },
  onChange: { description: 'Action performed when clicking the switch' },
  size: {
    description: 'Adjusts the size of the switch',
    control: { type: 'select' },
    options: HoliSwitchSizes,
    defaultValue: 'medium',
  },
  disabled: {
    description: 'Disables the switch',
    defaultValue: 'false',
  },
  duration: { description: 'Duration of the toggle animation', defaultValue: 300 },
}

export const All = ({ ...args }) => {
  const samples = HoliSwitchSizes.map((size) => {
    return (
      <div key={size} style={{ marginBottom: 16 }}>
        <div style={{ opacity: 0.5, marginBottom: 8 }}>{size}</div>
        <HoliSwitch
          size={size}
          value={args.value}
          onChange={args.onChange}
          disabled={args.disabled}
          duration={args.duration}
        />
      </div>
    )
  })
  return <div style={{ padding: '16px' }}>{samples}</div>
}
