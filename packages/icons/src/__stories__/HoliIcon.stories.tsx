import React from 'react'

import * as HoliIcons from '../generated' // eslint-disable-line no-restricted-imports

export default {
  title: 'Atoms/HoliIcon',
  parameters: {
    docs: {
      description: {
        component: 'HoliIcon - icon components.',
      },
    },
  },
}

function showIcons(args: typeof All.args) {
  return Object.entries(HoliIcons).map(([iconName, SvgComponent]) => (
    <div className={'icon'} key={iconName}>
      <SvgComponent {...args} />
      <div>{iconName}</div>
    </div>
  ))
}

export function All(args: typeof All.args) {
  return (
    <>
      <div className="svg-preview">
        <div className="icons">{showIcons(args)}</div>
      </div>
    </>
  )
}

All.args = {
  color: '#333',
  size: 32,
}
All.argTypes = {
  color: { control: { type: 'color' } },
  size: { control: { type: 'number' } },
  width: { control: { type: 'number' } },
  height: { control: { type: 'number' } },
}
