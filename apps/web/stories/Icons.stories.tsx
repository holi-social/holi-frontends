/* eslint-disable import/no-anonymous-default-export */
import React from 'react'

import iconSelection from '@holi/ui/assets/fonts/holicons/selection.json'
import Holicon from '@holi/ui/components/holicon'
import theme from '@holi/ui/styles/theme'

export default {
  title: 'Components/Icons',
  parameters: {
    docs: {
      description: {
        component: 'Holicon - icon component.',
      },
    },
  },
}

export const Primary = ({ ...args }) => <Holicon icon={args.icon} size={args.size} color={args.color} />
Primary.args = {}
Primary.argTypes = {
  color: { defaultValue: theme.colors.fontColorBlack, control: { type: 'color' } },
  icon: {
    type: 'select',
    defaultValue: 'app-edit',
    options: iconSelection.icons.map((icon) => icon?.properties?.name),
  },
  size: { defaultValue: 32, control: { type: 'number' } },
}

export const All = ({ ...args }) => {
  return (
    <div style={{ padding: '16px' }}>
      {iconSelection.icons.map((icon, index) => (
        <div
          key={index}
          style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '128px', padding: '16px' }}
        >
          <div style={{ border: `1px dashed ${theme.colors.fontColorBlack}` }}>
            <Holicon icon={icon?.properties?.name} size={32} color={args.color} />
          </div>
          <div style={{ fontSize: '16px', marginTop: '16px', wordBreak: 'break-all' }}>{icon?.properties?.name}</div>
        </div>
      ))}
    </div>
  )
}

All.argTypes = {
  color: { defaultValue: theme.colors.fontColorBlack, control: { type: 'color' } },
}
