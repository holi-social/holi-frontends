import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import DonationImage from '@holi-apps/donations/components/DonationImage'

export default {
  title: 'Donations/Organisms/DonationImage',
  component: DonationImage,
  parameters: {
    docs: {
      description: {
        component: 'DonationImage - image component using HoliImage tailored for usage in the donation app',
      },
    },
  },
} as ComponentMeta<typeof DonationImage>

const Template: ComponentStory<typeof DonationImage> = ({ ...args }) => <DonationImage {...args} />

const argTypes = {
  picture: {
    description: 'the picture in its different variants',
    control: false,
  },
  label: {
    description: 'the alt text to set (leave empty for no alt text)',
  },
  style: { description: 'Wrapper style override', control: false },
  resizeMode: {
    description: 'the resizeMode for the image',
    options: ['cover', 'contain', 'fill', 'none', 'scale-down', undefined], // An array of serializable values
    control: {
      type: 'select',
    },
  },
}

export const Responsive: ComponentStory<typeof DonationImage> = Template.bind({})

Responsive.argTypes = argTypes

Responsive.args = {
  imageUrl: 'http://placekitten.com/1400/933',
  label: 'Donate for cute kittens',
  style: {
    maxWidth: 1200,
    width: '100%',
    height: 'auto',
  },
  resizeMode: 'cover',
}

export const FixedSize: ComponentStory<typeof DonationImage> = Template.bind({})

FixedSize.argTypes = argTypes

FixedSize.args = {
  imageUrl: 'http://placekitten.com/500/500',
  label: 'Donate for cute kittens',
  style: {
    width: 100,
    height: 100,
  },
  resizeMode: 'cover',
}

export const Original: ComponentStory<typeof DonationImage> = Template.bind({})

Original.argTypes = argTypes

Original.args = {
  imageUrl: 'http://placekitten.com/500/500',
  label: 'Donate for cute kittens',
  style: {},
  resizeMode: 'cover',
}
