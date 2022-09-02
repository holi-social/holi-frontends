import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliAppSwiper from '@holi/ui/components/organisms/HoliAppSwiper'
import { colors } from '@holi/ui/styles/globalVars'

const apps = [
  {
    name: 'Volunteering',
    label: 'Volunteering label',
    hasUpdates: true,
    backgroundColor: colors.impactyellow,
  },
  {
    name: 'Donations',
    label: 'Donations label',
    hasUpdates: false,
    backgroundColor: colors.positivepurple,
  },
  {
    name: 'Good News',
    label: 'Good News label',
    hasUpdates: true,
    backgroundColor: colors.softblackLight,
  },
  {
    name: 'Ads for Good',
    label: 'Ads for Good label',
    hasUpdates: true,
    backgroundColor: colors.impactyellow,
  },
  {
    name: 'FactCheck',
    label: 'FactCheck label',
    hasUpdates: false,
    backgroundColor: colors.backgroundColorGrey,
  },
]

export default {
  title: 'Organisms/HoliAppSwiper',
  component: HoliAppSwiper,
} as ComponentMeta<typeof HoliAppSwiper>

const Template: ComponentStory<typeof HoliAppSwiper> = ({ ...args }) => <HoliAppSwiper {...args} />

export const Example: ComponentStory<typeof HoliAppSwiper> = Template.bind({})

Example.argTypes = {
  apps: { description: 'App information with name and icon', control: false },
  moreAppsLabel: { description: 'Label for button to see more apps' },
}

Example.args = {
  apps,
  moreAppsLabel: 'More apps...',
}
