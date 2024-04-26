import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard from '@holi/ui/components/molecules/HoliCard'

export default {
  title: 'Molecules/HoliCard',
  component: HoliCard,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for cards.',
      },
    },
  },
} as Meta<typeof HoliCard>

const Template: StoryFn<typeof HoliCard> = ({ ...props }) => {
  return (
    <View style={{ width: 300, height: 600 }}>
      <HoliCard {...props}>
        <HoliText style={{ textAlign: 'left' }}>Education</HoliText>
        <HoliText style={{ textAlign: 'left' }}>Reading to children after school in kreuzberg</HoliText>
      </HoliCard>
    </View>
  )
}

export const BasicExample: StoryFn<typeof HoliCard> = Template.bind({})
export const SecondaryVariant: StoryFn<typeof HoliCard> = Template.bind({})

const defaultTypes = {
  imageUrl: { description: 'Image Url', required: true, control: { type: 'text' } },
  imageLabel: { description: 'Accessibility Label', control: { type: 'text' } },
  imageWidth: { description: 'Requested image width', control: { type: 'number' } },
  imageAspectRatio: { description: 'The image aspect ration', control: { type: 'number' } },
  hasBorder: { description: 'A variant with a border', control: { type: 'boolean' } },
  testID: { description: 'Test id', control: { type: 'text' } },
}

const defaultProps = {
  imageUrl: 'https://login.freiwilligenarbeit.de/api/v1/content_delivery/images/4620/volunteering-michigan-teaser.jpg',
  imageLabel: 'volunteering',
  imageWidth: 1200,
  testID: 'holiCard',
}

BasicExample.argTypes = { ...defaultTypes }
BasicExample.args = { ...defaultProps }
SecondaryVariant.argTypes = { ...defaultTypes }
SecondaryVariant.args = { ...defaultProps, hasBorder: true, imageAspectRatio: 1 }
