import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper, { HoliGridWrapperProps } from '@holi/ui/components/atoms/HoliGridWrapper'

export default {
  title: 'Atoms/HoliGridWrapper',
  parameters: {
    docs: {
      description: {
        component: 'HoliGridWrapper - grid component.',
      },
    },
  },
} as ComponentMeta<typeof HoliGridWrapper>

export const Primary: ComponentStory<typeof HoliGridWrapper> = ({ gap, itemsInRow }: HoliGridWrapperProps) => (
  <HoliGridWrapper gap={gap} itemsInRow={itemsInRow} style={{ width: '100%' }}>
    {Array.from('i'.repeat(22), (_, idx) => idx + 1).map((itm) => (
      <HoliGridCell key={itm}>
        <View style={{ padding: 48, backgroundColor: 'red', alignItems: 'center' }}>{itm}</View>
      </HoliGridCell>
    ))}
  </HoliGridWrapper>
)

Primary.args = {
  gap: 24,
  itemsInRow: 2,
}

Primary.argTypes = {
  gap: {
    description: 'Gap between items',
    type: 'number',
    defaultValue: 24,
    control: { type: 'number' },
  },
  itemsInRow: {
    description: 'Amount of items in each row',
    type: 'number',
    defaultValue: 2,
    control: { type: 'number' },
  },
}
