import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'

export default {
  title: 'Molecules/HoliAvatar',
  component: HoliAvatar,
} as ComponentMeta<typeof HoliAvatar>

const Template: ComponentStory<typeof HoliAvatar> = ({ ...args }) => {
  return <HoliAvatar {...args} />
}

export const BasicExample: ComponentStory<typeof HoliAvatar> = Template.bind({})

BasicExample.argTypes = {
  loading: { description: 'Loading', required: true, control: { type: 'boolean' } },
  label: { description: 'Label', required: true, control: { type: 'text' } },
  imageSrc: {
    description: 'Image URL',
    type: 'string',
    options: ['https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg', undefined],
    control: { type: 'select' },
  },
  defaultColor: {
    description: 'Default color',
    type: 'string',
    control: { type: 'text' },
  },
  initials: { description: 'Initials of user', required: true, control: { type: 'text' } },
  size: {
    description: 'Size of the avatar',
    options: ['micro', 'small', 'medium', 'large', 'extralarge'],
    control: { type: 'select' },
  },
}

BasicExample.args = {
  loading: false,
  label: 'Uschi Meyer',
  imageSrc: undefined,
  defaultColor: 'pink',
  initials: 'UM',
  size: 'extralarge',
}
