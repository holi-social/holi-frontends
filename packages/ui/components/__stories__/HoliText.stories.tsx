import React, { Fragment } from 'react'

import HoliText, { HoliTextSizes } from '@holi/ui/components/HoliText'
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

export const Primary = ({ ...args }) => <HoliText {...args} />
Primary.args = {
  children: 'Text',
  size: 'default',
  bold: false,
  selectable: true,
}
Primary.argTypes = {
  children: {
    description: 'React.ReactChild | React.ReactChild[] | string',
    control: { type: 'text' },
  },
  size: {
    description: 'adjusts the size of the text',
    control: { type: 'select', options: HoliTextSizes },
  },
  bold: {
    description: 'adjusts the boldness of the text',
  },
  selectable: { description: 'Should text be selectable?' },
}

export const Colored = () => (
  <Fragment>
    <div style={{ opacity: 0.2 }}>Colored example</div>
    <HoliText size="default" style={{ color: theme.colors.positivepurple }}>
      Positive purple
    </HoliText>
  </Fragment>
)

export const All = ({ ...args }) => {
  const samples = HoliTextSizes.map((size) => {
    return [true, false].map((bold: boolean) => {
      return (
        <div key={size} style={{ marginBottom: '16px' }}>
          <div style={{ opacity: 0.2 }}>{size}</div>
          <HoliText
            size={size}
            bold={bold}
            styles={{
              color: args.color,
            }}
          >
            This is a {size}, {bold ? 'bold' : 'non-bold'} text.
          </HoliText>
        </div>
      )
    })
  })
  return <div style={{ padding: '16px' }}>{samples}</div>
}
