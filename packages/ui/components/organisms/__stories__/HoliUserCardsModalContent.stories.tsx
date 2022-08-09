import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'

const users = fakeTopics.get('abc').editors

export default {
  title: 'Organisms/HoliUserCardsModalContent',
  component: HoliUserCardsModalContent,
} as ComponentMeta<typeof HoliUserCardsModalContent>

const Template: ComponentStory<typeof HoliUserCardsModalContent> = ({ ...args }) => (
  <HoliUserCardsModalContent style={{ minHeight: 550 }} {...args} />
)

export const Example: ComponentStory<typeof HoliUserCardsModalContent> = Template.bind({})

Example.argTypes = {
  users: { description: 'Array of users', required: true, control: { type: 'object' } },
  onDismiss: { description: 'Close modal function', type: 'function' },
  category: { description: 'Topic category', type: 'string' },
  title: { description: 'Modal title', type: 'string' },
}

Example.args = {
  users,
  onDismiss: () => alert('dismissed'),
  category: 'Sustainablitity',
  title: 'Editors talking sustainability',
}
