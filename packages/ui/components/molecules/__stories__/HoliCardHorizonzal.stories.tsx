import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliCardHorizontal, { type Props } from '@holi/ui/components/molecules/HoliCardHorizontal'

export default {
  title: 'Molecules/HoliCardHorizontal',
  component: HoliCardHorizontal,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for horizontal cards.',
      },
    },
  },
} as Meta<typeof HoliCardHorizontal>

const Template: StoryFn<typeof HoliCardHorizontal> = (props) => {
  return (
    <View style={{ height: '100%', width: '100%', padding: 120, backgroundColor: 'lightgray' }}>
      <View style={{ maxWidth: 360 }}>
        <HoliCardHorizontal {...props} />
      </View>

      <View>
        <HoliSkeleton height={100} width={200} borderRadius={16} />
      </View>
    </View>
  )
}

export const BasicExample: StoryFn<typeof HoliCardHorizontal> = Template.bind({})

const defaultTypes = {
  imageUrl: { description: 'Image Url', required: true, control: { type: 'text' } },
  imageLabel: { description: 'Accessibility Label', control: { type: 'text' } },
  text: { description: 'Text inside of the card', control: { type: 'text' } },
  testID: { description: 'Test id', control: { type: 'text' } },
}

const defaultProps: Props = {
  imageUrl: 'https://login.freiwilligenarbeit.de/api/v1/content_delivery/images/4620/volunteering-michigan-teaser.jpg',
  imageLabel: 'volunteering',
  text: 'One-line description',
  testID: 'holiCard',
}

BasicExample.argTypes = { ...defaultTypes }
BasicExample.args = { ...defaultProps }
