import React from 'react'

import { HoliHeading, HoliHeadingSize } from '@holi/ui/components/atoms/HoliHeading'

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
    control: { type: 'select', options: ['1', '2', '3'] },
  },
  selectable: { description: 'Should text be selectable?' },
  numberOfLines: {
    description: 'Limit the heading to this number of lines',
    control: { type: 'number' },
  },
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
    control: { type: 'select', options: ['xl', 'l', 'm', 's'] },
  },
  level: {
    description: 'determines the accessibilityLevel',
    control: { type: 'select', options: ['1', '2', '3'] },
  },
  selectable: { description: 'Should text be selectable?' },
  italic: { description: 'Should text be italic?', control: { type: 'boolean' } },
  numberOfLines: {
    description: 'Limits the text to this number of lines',
    control: { type: 'number' },
  },
}

export const All = () => {
  const sizes: HoliHeadingSize[] = ['xl', 'l', 'm', 's']
  const samples = sizes.map((size) => {
    return (
      <div key={size} style={{ marginBottom: '16px' }}>
        <div style={{ opacity: 0.2 }}>{size}</div>
        <HoliHeading size={size}>This is a headline of size {size}</HoliHeading>
      </div>
    )
  })
  const italicSizes: HoliHeadingSize[] = ['l', 'm']
  const italicSamples = italicSizes.map((size) => {
    return (
      <div key={size} style={{ marginBottom: '16px' }}>
        <div style={{ opacity: 0.2 }}>italic {size}</div>
        <HoliHeading size={size} italic>
          This is an italic headline of size {size}
        </HoliHeading>
      </div>
    )
  })
  return <div style={{ padding: '16px' }}>{samples.concat(italicSamples)}</div>
}
