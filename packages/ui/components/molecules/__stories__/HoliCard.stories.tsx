import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

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
} as ComponentMeta<typeof HoliCard>

const Template: ComponentStory<typeof HoliCard> = ({ ...args }) => {
  return (
    <HoliCard {...args}>
      <HoliText style={{ textAlign: 'left' }}>Education</HoliText>
      <HoliText style={{ textAlign: 'left' }}>Reading to children after school in kreuzberg</HoliText>
    </HoliCard>
  )
}

export const BasicExample: ComponentStory<typeof HoliCard> = Template.bind({})

BasicExample.argTypes = {
  imageUrl: { description: 'Image Url', required: true, control: { type: 'text' } },
  imageLabel: { description: 'Accessibility Label', control: { type: 'text' } },
  imageWidth: { description: 'Requested image width', control: { type: 'number' } },
  testID: { description: 'Test id', control: { type: 'text' } },
  style: { description: 'Custom styles' },
}

BasicExample.args = {
  imageUrl: 'https://login.freiwilligenarbeit.de/api/v1/content_delivery/images/4620/volunteering-michigan-teaser.jpg',
  imageLabel: 'volunteering',
  imageWidth: 1200,
  testID: 'holiCard',
  style: { width: 300, height: 600 },
}
