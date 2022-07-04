/* eslint-disable import/no-anonymous-default-export */
import React, { Fragment } from 'react'

import HoliHeading, { HoliHeadingLevels, HoliHeadingSizes } from '@holi/ui/components/HoliHeading'
import theme from '@holi/ui/styles/theme'

export default {
  title: 'Components/HoliHeading',
  parameters: {
    docs: {
      description: {
        component: 'Primary UI heading component.',
      },
    },
  },
}

export const Primary = ({ ...args }) => <HoliHeading {...args} />
Primary.args = {
  children: 'Text',
  size: 'large',
  level: 1,
  selectable: true,
}
Primary.argTypes = {
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
    <HoliHeading size="large" styles={{ color: theme.colors.positivepurple }}>
      Positive purple
    </HoliHeading>
  </Fragment>
)

export const All = ({ ...args }) => {
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
