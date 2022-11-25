import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'

const users = Array.from(' '.repeat(6), (_, idx) => getRandomUser(!(idx % 2)))

export default {
  title: 'Organisms/HoliUserCardsModalContent',
  component: HoliUserCardsModalContent,
} as ComponentMeta<typeof HoliUserCardsModalContent>

const Template: ComponentStory<typeof HoliUserCardsModalContent> = (props) => (
  <HoliUserCardsModalContent style={{ minHeight: 550 }} {...props} />
)

export const Example: ComponentStory<typeof HoliUserCardsModalContent> = Template.bind({})

Example.argTypes = {
  users: { description: 'Array of users', required: true, control: { type: 'object' } },
  onDismiss: { description: 'Close modal function', type: 'function' },
  category: { description: 'Insight category', type: 'string' },
  title: { description: 'Modal title', type: 'string' },
}

Example.args = {
  users,
  onDismiss: () => alert('dismissed'),
  category: 'Sustainablitity',
  title: 'Editors talking sustainability',
}
