import React, { Fragment } from 'react'

import HoliSwitch, { HoliSwitchSizes } from '@holi/ui/components/atoms/HoliSwitch'

export default {
  title: 'Atoms/HoliSwitch',
  parameters: {
    docs: {
      description: {
        component: 'Primary UI switch/toggle component.',
      },
    },
  },
}

export const Primary = ({ ...args }) => <HoliSwitch {...args} />
Primary.args = {
  size: 'default',
  deactivatedText: 'Off',
  activatedText: 'On',
  label: 'Label',
  disabled: false,
}
Primary.argTypes = {
  size: {
    description: 'adjusts the size of the switch',
    control: { type: 'select', options: HoliSwitchSizes },
  },
  deactivatedText: {
    description: 'sets the text for the left handle',
  },
  activatedText: {
    description: 'sets the text for the right handle',
  },
  disabled: {
    description: 'disables the switch',
  },
  label: { description: 'sets the header label of the switch' },
}

export const Small = () => (
  <Fragment>
    <div style={{ opacity: 0.2 }}>Small example</div>
    <HoliSwitch size="small" deactivatedText="Off" activatedText="On" label="Label" />
  </Fragment>
)

export const Large = () => (
  <Fragment>
    <div style={{ opacity: 0.2 }}>Large example</div>
    <HoliSwitch size="large" deactivatedText="Off" activatedText="On" label="Label" />
  </Fragment>
)

export const Extralarge = () => (
  <Fragment>
    <div style={{ opacity: 0.2 }}>Extralarge example</div>
    <HoliSwitch size="extralarge" deactivatedText="Off" activatedText="On" label="Label" />
  </Fragment>
)

export const All = () => {
  const samples = HoliSwitchSizes.map((size) => {
    return (
      <div key={size} style={{ marginBottom: '16px' }}>
        <div style={{ opacity: 0.2 }}>{size}</div>
        <HoliSwitch size={size} deactivatedText="Off" activatedText="On" />
      </div>
    )
  })
  return <div style={{ padding: '16px' }}>{samples}</div>
}
