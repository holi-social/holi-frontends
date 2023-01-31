import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { User } from '@holi/core/screens/userprofile/types'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

const users: User[] = [
  {
    id: '1',
    fullName: 'Dima Rosmait',
    firstName: 'Dima',
    lastName: 'Rosmait',
    avatarLabel: 'D',
    avatarDefaultColor: 'green',
    avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
    aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipisici elit.',
  },
  {
    id: '2',
    fullName: 'Max Mustermann',
    firstName: 'Max',
    lastName: 'Mustermann',
    avatarLabel: 'M',
    avatarDefaultColor: 'red',
    aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipisici elit.',
  },
  {
    id: '3',
    fullName: 'Thomas Mueller',
    firstName: 'Thomas',
    lastName: 'Mueller',
    avatarLabel: 'T',
    avatarDefaultColor: 'blue',
    avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
    aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipisici elit.',
  },
  {
    id: '4',
    fullName: 'Sandra Kasandra',
    firstName: 'Sandra',
    lastName: 'Kasandra',
    avatarLabel: 'S',
    avatarDefaultColor: 'yellow',
    aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipisici elit.',
  },
  {
    id: '5',
    fullName: 'Peter Pan',
    firstName: 'Peter',
    lastName: 'Pan',
    avatarLabel: 'P',
    avatarDefaultColor: 'grey',
    avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
    aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipisici elit.',
  },
  {
    id: '6',
    fullName: 'Donald Duck',
    firstName: 'Donald',
    lastName: 'Duck',
    avatarLabel: 'D',
    avatarDefaultColor: 'purple',
    aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipisici elit.',
  },
  {
    id: '7',
    fullName: 'Lionel Messi',
    firstName: 'Lionel',
    lastName: 'Messi',
    avatarLabel: 'L',
    avatarDefaultColor: 'black',
    avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
    aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipisici elit.',
  },
]

export default {
  title: 'Organisms/HoliCarousel',
  component: HoliCarousel,
} as ComponentMeta<typeof HoliCarousel>

const Template: ComponentStory<typeof HoliCarousel> = (props) => <HoliCarousel {...props} />

export const Example: ComponentStory<typeof HoliCarousel> = Template.bind({})

Example.argTypes = {
  slides: { description: 'Slides components', required: true, control: { type: 'object' } },
}

Example.args = {
  slides: users.map((user) => ({
    children: <HoliUserCard style={{ width: '100%' }} user={user} />,
  })),
}
