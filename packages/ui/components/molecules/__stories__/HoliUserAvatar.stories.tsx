import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'

export default {
  title: 'Components/HoliUserAvatar',
  component: HoliUserAvatar,
} as ComponentMeta<typeof HoliUserAvatar>

const Template: ComponentStory<typeof HoliUserAvatar> = ({ ...args }) => {
  return (
    <HoliUserAvatar
      nameLabel={args.nameLabel}
      imageSrc={args.imageSrc}
      defaultColor={args.defaultColor}
      initials={args.initials}
      size={args.size}
    />
  )
}

export const BasicExample: ComponentStory<typeof HoliUserAvatar> = Template.bind({})

BasicExample.argTypes = {
  nameLabel: { description: 'Username', required: true, control: { type: 'text' } },
  imageSrc: {
    description: 'Url to the image',
    type: 'string',
    options: ['https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg', undefined],
    control: { type: 'select' },
  },
  defaultColor: {
    description: 'Disables interaction',
    type: 'string',
    control: { type: 'text' },
  },
  initials: { description: 'Initials of user', required: true, control: { type: 'text' } },
  size: {
    description: 'Checked or unchecked state',
    options: ['micro', 'small', 'medium', 'large', 'extralarge'],
    control: { type: 'select' },
  },
}

BasicExample.args = {
  nameLabel: 'Uschi Meyer',
  imageSrc: undefined,
  defaultColor: 'pink',
  initials: 'UM',
  size: 'extralarge',
}
