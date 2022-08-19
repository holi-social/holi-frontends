import React, { useState } from 'react'

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
  const [filteredIcons, setFilteredIcons] = useState(iconSelection.icons)

  const filter = (event) => {
    const iconList = iconSelection.icons || []
    const filterString = event.target.value
    if (!filterString || filterString.length <= 3) {
      setFilteredIcons(iconList)
    }
    const filteredItems = iconList.filter((icon) => icon?.properties?.name?.indexOf(filterString) >= 0)
    setFilteredIcons(filteredItems)
  }

  return (
    <div className="svg-preview">
      <label>
        Filter:
        <input type="text" onChange={filter} />
      </label>
      <div className="icons">
        {filteredIcons.map((icon, index) => (
          <div key={index} className="icon-container">
            <a>
              <HoliIcon icon={icon?.properties?.name} size={32} />
            </a>
            <div>{icon?.properties?.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
All.args = {
  color: colors.fontColorBlack,
}
All.argTypes = {
  color: { control: { type: 'color' } },
}
