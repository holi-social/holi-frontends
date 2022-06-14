/* eslint-disable import/no-anonymous-default-export */
import { color, text } from '@storybook/addon-knobs'
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
    control: { type: 'select', options: Object.keys(HoliTextType) },
  },
  isAccessible: { description: 'boolean', control: { type: 'boolean' } },
}

export const Colored = ({ ...args }) => (
  <Fragment>
    <div style={{ opacity: 0.2 }}>Colored example</div>
    <HoliText type={HoliTextType.super} styles={{ color: theme.colors.positivepurple }}>
      Positive purple
    </HoliText>
    <HoliText type={HoliTextType.super} styles={{ color: theme.colors.grey }}>
      {' Grey'}
    </HoliText>
  </Fragment>
)

export const All = () => {
  const types = Object.keys(HoliTextTypes)
  const samples = types.map((type) => {
    return (
      <div key={type} style={{ marginBottom: '16px' }}>
        <div style={{ opacity: 0.2 }}>{type}</div>
        <HoliText
          type={type as HoliTextType}
          styles={{
            color: color('color', theme.colors.fontColorBlack),
          }}
        >
          {text(type, type)}
        </HoliText>
      </div>
    )
  })
  return <div style={{ padding: '16px' }}>{samples}</div>
}
