import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCardComponent from '@holi/ui/components/molecules/HoliCardComponent'

export default {
  title: 'Molecules/HoliCardComponent',
  component: HoliCardComponent,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for cards.',
      },
    },
  },
} as ComponentMeta<typeof HoliCardComponent>

const handleCardPress = () => {
  console.log('handle card press')
}

const Template: ComponentStory<typeof HoliCardComponent> = ({ ...args }) => {
  return (
    <HoliCardComponent {...args}>
      <HoliText style={{ textAlign: 'left' }}>Education</HoliText>
      <HoliText style={{ textAlign: 'left' }}>Reading to children after school in kreuzberg</HoliText>
    </HoliCardComponent>
  )
}

export const BasicExample: ComponentStory<typeof HoliCardComponent> = Template.bind({})

BasicExample.argTypes = {
  imageUrl: { description: 'Image Url', required: true, control: { type: 'text' } },
  imageLabel: { description: 'Accessibility Label', control: { type: 'text' } },
  testID: { description: 'Test id', control: { type: 'text' } },
  style: { description: 'Custom styles' },
  onCardPress: { description: 'Call back method to handle card press' },
}

BasicExample.args = {
  imageUrl: 'https://login.freiwilligenarbeit.de/api/v1/content_delivery/images/4620/volunteering-michigan-teaser.jpg',
  imageLabel: 'volunteering',
  testID: 'holiCard',
  style: { width: 300, height: 600 },
  onCardPress: handleCardPress,
}
