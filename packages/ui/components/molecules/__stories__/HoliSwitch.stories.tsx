import React, { Fragment, useState } from 'react'

import HoliSwitch, { HoliSwitchSizes } from '@holi/ui/components/molecules/HoliSwitch'
import { useTheme } from '@holi/ui/styles/theme'

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
    args.switchOn = !on
    setOn(!on)
  }
  return (
    <HoliSwitch
      onPress={handleOnChange}
      switchOn={args.switchOn || on}
      size={args.size}
      disabled={args.disabled}
      duration={args.duration}
      circleColor={args.circleColor}
      backgroundColor={args.backgroundColor}
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
  onPress: { description: 'Action performed when clicking the switch' },
  circleColor: {
    description: 'Circle color',
    control: { type: 'select' },
    options: Primary.colorChoices,
  },
  backgroundColor: {
    description: 'Background color',
    control: { type: 'select' },
    options: Primary.colorChoices,
  },
}

export const Colored = () => {
  const { theme } = useTheme()
  const { colors } = theme
  return (
    <Fragment>
      <div style={{ opacity: 0.5, marginBottom: 8 }}>Colored examples</div>
      <HoliSwitch switchOn={true} backgroundColor={colors.foreground10} circleColor={colors.brandC300} />
      <HoliSwitch switchOn={false} backgroundColor="lightsteelblue" circleColor="fuchsia" />
      <HoliSwitch switchOn={true} backgroundColor={colors.brandA300} circleColor="black" />
    </Fragment>
  )
}

export const All = ({ ...args }) => {
  const samples = HoliSwitchSizes.map((size) => {
    return (
      <div key={size} style={{ marginBottom: 16 }}>
        <div style={{ opacity: 0.5, marginBottom: 8 }}>{size}</div>
        <HoliSwitch size={size} onPress={args.onPress} switchOn={args.switchOn} disabled={args.disabled} />
      </div>
    )
  })
  return <div style={{ padding: '16px' }}>{samples}</div>
}
