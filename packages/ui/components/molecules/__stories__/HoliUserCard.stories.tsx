import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { User } from '@holi/core/screens/userprofile/types'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'

export default {
  title: 'Molecules/HoliUserCard',
  component: HoliUserCard,
} as ComponentMeta<typeof HoliUserCard>

const user: User = {
  id: '1',
  firstName: 'DJ',
  lastName: 'Qualls',
  avatarLabel: 'D',
  avatarDefaultColor: 'green',
  avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
  aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipisici elit.',
}

const Template: ComponentStory<typeof HoliUserCard> = ({ ...args }) => {
  return <HoliUserCard {...args} />
}

export const BasicExample: ComponentStory<typeof HoliUserCard> = Template.bind({})

BasicExample.argTypes = {
  user: { description: 'User object', required: true, control: { type: 'object' } },
  variant: { description: 'Card variant (small or normal)', control: { type: 'select', options: ['small', 'normal'] } },
  category: {
    description: 'User category chip',
    type: 'string',
    control: { type: 'text' },
  },
}

BasicExample.args = {
  user,
  variant: 'normal',
  category: 'Immigration',
}
