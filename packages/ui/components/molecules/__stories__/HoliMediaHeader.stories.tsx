import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'

export default {
  title: 'Molecules/HoliMediaHeader',
  component: HoliMediaHeader,
} as ComponentMeta<typeof HoliMediaHeader>

const Template: ComponentStory<typeof HoliMediaHeader> = ({ ...args }) => {
  return <HoliMediaHeader {...args} onAvatarPressed={() => undefined} onTitlePressed={() => undefined} />
}

export const Primary: ComponentStory<typeof HoliMediaHeader> = Template.bind({})

Primary.argTypes = {
  title: { description: 'Title', type: 'string', control: { type: 'text' } },
  titleLabel: { description: 'Title Label', type: 'string', control: { type: 'text' } },
  titleBold: { description: 'Title is bold', type: 'boolean' },
  date: { description: 'Date', type: 'string', control: { type: 'text' } },
}

Primary.args = {
  loading: false,
  avatarProps: {
    label: 'Saving the foxes',
    initials: 'SF',
    size: 'lg',
  },
  title: 'Saving the foxes',
  titleLabel: 'Saving the foxes',
  titleBold: false,
  date: '2022-11-18',
}
