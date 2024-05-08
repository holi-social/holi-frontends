import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'

export default {
  title: 'Atoms/HoliMoreCard',
  component: HoliMoreCard,
  parameters: {
    docs: {
      description: {
        component: 'A see more or add more card usually used at the end of a carousel',
      },
    },
  },
} as Meta<typeof HoliMoreCard>

const Template: StoryFn<typeof HoliMoreCard> = ({ ...props }) => {
  return (
    <View style={{ height: 400, width: 456, padding: 40 }}>
      <HoliMoreCard {...props}>See More Spaces</HoliMoreCard>
    </View>
  )
}

export const BasicExample: StoryFn<typeof HoliMoreCard> = Template.bind({})

const defaultTypes = {
  label: { description: 'Label for the pressable card', control: { type: 'text' } },
  onPress: {
    required: true,
    description: 'A function to allow to navigate and handle on press behaviour',
    control: { type: 'function' },
  },
  role: { description: 'Requested image width', required: true, control: { type: 'string' } },
  testID: { description: 'Test id', control: { type: 'text' } },
}

const defaultProps = {
  onPress: () => void '',
  label: 'Holie See More Card',
  testID: 'Holi See More Card',
}

BasicExample.argTypes = { ...defaultTypes }
BasicExample.args = {
  role: 'link',
  ...defaultProps,
}
