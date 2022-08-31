import React, { Fragment } from 'react'

import HoliHeading, { HoliHeadingLevels, HoliHeadingSizes } from '@holi/ui/components/atoms/HoliHeading'
import { colors } from '@holi/ui/styles/globalVars'

export default {
  title: 'Atoms/HoliHeading',
  parameters: {
    docs: {
      description: {
        component: 'Primary UI heading component.',
      },
    },
  },
}

export const ByLevel = ({ ...args }) => <HoliHeading {...args} />
ByLevel.args = {
  children: 'Text',
  level: 2,
  selectable: true,
}
ByLevel.argTypes = {
  children: {
    description: 'React.ReactChild | React.ReactChild[] | string',
    control: { type: 'text' },
  },
  level: {
    description: 'determines the accessibilityLevel',
    control: { type: 'select', options: HoliHeadingLevels },
  },
  selectable: { description: 'Should text be selectable?' },
}

export const ByLevelAndSize = ({ ...args }) => <HoliHeading {...args} />
ByLevelAndSize.args = {
  children: 'Text',
  size: 'large',
  level: 1,
  selectable: true,
}
ByLevelAndSize.argTypes = {
  children: {
    description: 'React.ReactChild | React.ReactChild[] | string',
    control: { type: 'text' },
  },
  size: {
    description: 'adjusts the size of the text',
    control: { type: 'select', options: HoliHeadingSizes },
  },
  level: {
    description: 'determines the accessibilityLevel',
    control: { type: 'select', options: HoliHeadingLevels },
  },
  selectable: { description: 'Should text be selectable?' },
}

export const Colored = () => (
  <Fragment>
    <div style={{ opacity: 0.2 }}>Colored example</div>
    <HoliHeading size="large" style={{ color: colors.positivepurple }}>
      Positive purple
    </HoliHeading>
  </Fragment>
)

export const All = () => {
  const sizes = HoliHeadingSizes
  const samples = sizes.map((size) => {
    return (
      <div key={size} style={{ marginBottom: '16px' }}>
        <div style={{ opacity: 0.2 }}>{size}</div>
        <HoliHeading size={size}>This is a headline of size {size}</HoliHeading>
      </div>
    )
  })
  return <div style={{ padding: '16px' }}>{samples}</div>
}
