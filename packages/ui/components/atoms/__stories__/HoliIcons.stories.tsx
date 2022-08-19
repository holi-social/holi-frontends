import React from 'react'

import iconSelection from '@holi/ui/assets/fonts/HoliIcons/regular/selection.json'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

export default {
  title: 'Atoms/HoliIcons',
  parameters: {
    docs: {
      description: {
        component: 'HoliIcons - icon component.',
      },
    },
  },
}

export const Primary = ({ ...args }) => (
  <HoliIcon icon={args.icon} size={args.size} filled={args.filled} color={args.color} />
)
Primary.args = {
  icon: 'home-smile',
  color: colors.positivepurple,
  filled: false,
  size: 50,
}
Primary.argTypes = {
  color: { control: { type: 'color' } },
  icon: {
    type: 'select',
    options: iconSelection.icons.map((icon) => icon?.properties?.name),
  },
  filled: { control: { type: 'boolean' } },
  size: { control: { type: 'number' } },
}

export const All = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {iconSelection.icons.map((icon, index) => (
        <div
          key={index}
          className="svg-preview"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '128px',
            padding: 0,
          }}
        >
          <a style={{ display: 'flex', border: `1px dashed ${colors.softblackTransparent}`, padding: 8 }}>
            <HoliIcon icon={icon?.properties?.name} size={32} />
          </a>
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: '14px',
              color: colors.fontColorGrey,
              marginTop: '10px',
              marginBottom: '20px',
              whiteSpace: 'nowrap',
            }}
          >
            {icon?.properties?.name}
          </div>
        </div>
      ))}
    </div>
  )
}
All.args = {
  color: colors.fontColorBlack,
}
All.argTypes = {
  color: { control: { type: 'color' } },
}
