import * as React from 'react'

import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export default {
  title: 'Molecules/HoliReactionsCount',
  parameters: {
    docs: {
      description: {
        component: 'HoliReactionsCount',
      },
    },
  },
}

export const Preview = ({ ...args }) => (
  <>
    <HoliReactionsCount
      onPress={() => {
        console.debug('click !!!!!')
      }}
      type={args.type}
      count={args.count}
      active={args.active}
      fullName={args.fullName}
    />
  </>
)

Preview.argTypes = {
  count: { description: 'countt', type: 'number', control: { type: 'number' } },
  active: { description: 'active', control: { type: 'boolean' } },
  type: {
    description: 'Post or comment',
    options: ['post', 'comment'],
    control: { type: 'select' },
  },
}

Preview.args = {
  fullName: 'Uschi Meyer',
  type: 'post',
  count: 3,
  active: false,
}
