import React, { Fragment } from 'react'

import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType, HoliTextTypes } from '@holi/ui/components/HoliText/HoliText.types'
import theme from '@holi/ui/styles/theme'

export default {
  title: 'Components/HoliText',
  parameters: {
    docs: {
      description: {
        component: 'Primary UI text component.',
      },
    },
  },
}

export const Primary = ({ ...args }) => <HoliText type={args.type}>{args.children}</HoliText>
Primary.args = {
  children: 'Text',
  type: HoliTextType.super,
  isAccessible: true,
}
Primary.argTypes = {
  children: {
    description: 'React.ReactChild | React.ReactChild[] | string',
    control: { type: 'text' },
  },
  type: {
    description: 'typeof HoliTextType',
    control: { type: 'select' },
    options: Object.keys(HoliTextType),
  },
  isAccessible: { description: 'boolean', control: { type: 'boolean' } },
}

export const Colored = () => (
  <Fragment>
    <div style={{ opacity: 0.2 }}>Colored example</div>
    <HoliText type={HoliTextType.super} styles={{ color: theme.colors.positivepurple }}>
      Positive purple
    </HoliText>
  </Fragment>
)

export const All = ({ ...args }) => {
  const types: HoliTextType[] = Object.keys(HoliTextTypes) as HoliTextType[]
  const samples = types.map((type: HoliTextType) => {
    return (
      <div key={type} style={{ marginBottom: '16px' }}>
        <div style={{ opacity: 0.2 }}>{type}</div>
        <HoliText
          type={type as HoliTextType}
          styles={{
            color: args.color,
          }}
        >
          {args[type]}
        </HoliText>
      </div>
    )
  })
  return <div style={{ padding: '16px' }}>{samples}</div>
}

All.args = {
  color: theme.colors.fontColorBlack,
  ...{
    ...Object.keys(HoliTextTypes).reduce((acc, curr) => {
      acc[curr] = curr
      return acc
    }, {}),
  },
}

All.argTypes = {
  color: { control: { type: 'color' } },
}
