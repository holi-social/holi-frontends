import React, { useState } from 'react'

import { ICONSET_FILLED, ICONSET_REGULAR } from '@holi/ui/assets/img/icons/HoliIcons/Iconset'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

export default {
  title: 'Atoms/HoliIcon',
  parameters: {
    docs: {
      description: {
        component: 'HoliIcon - icon component.',
      },
    },
  },
}

export const Primary = ({ ...args }) => (
  <HoliIcon icon={args.icon} size={args.size} filled={args.filled} color={args.color} />
)
Primary.args = {
  icon: 'home-smile-2',
  color: colors.brandColorB30,
  filled: false,
  size: 50,
}
Primary.argTypes = {
  color: { control: { type: 'color' } },
  icon: {
    type: 'select',
    options: { ...Object.keys(ICONSET_FILLED), ...Object.keys(ICONSET_REGULAR) },
  },
  filled: { control: { type: 'boolean' } },
  size: { control: { type: 'number' } },
}

export const All = () => {
  const iconList = { ...Object.keys(ICONSET_FILLED), ...Object.keys(ICONSET_REGULAR) }
  const [hoveredItem, setHoveredItem] = useState<string | null>()

  const setHoveredIcon = (icon: string, active: boolean) => {
    setHoveredItem(active ? icon : null)
  }

  return (
    <div className="svg-preview">
      <div className="icons">
        {iconList.map((icon, index) => (
          <div
            key={index}
            className="icon-container"
            onMouseEnter={() => setHoveredIcon(icon, true)}
            onMouseLeave={() => setHoveredIcon(icon, false)}
          >
            <a>
              <HoliIcon icon={icon} filled={icon === hoveredItem} size={32} />
            </a>
            <div>{icon}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
All.args = {
  color: colors.foreground30,
}
All.argTypes = {
  color: { control: { type: 'color' } },
}
