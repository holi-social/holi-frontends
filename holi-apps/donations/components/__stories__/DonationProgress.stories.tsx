import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import DonationProgress from '@holi-apps/donations/components/DonationProgress'

export default {
  title: 'Donations/Organisms/DonationProgress',
  component: DonationProgress,
} as ComponentMeta<typeof DonationProgress>

const Template: ComponentStory<typeof DonationProgress> = ({ ...args }) => <DonationProgress {...args} />

export const Primary: ComponentStory<typeof DonationProgress> = Template.bind({})

Primary.argTypes = {
  donationsCount: { description: 'Number of donations', control: { type: 'number' } },
  category: { description: 'Label/tag for the donations', control: { type: 'text' } },
  progressPercentage: { description: 'Progress in %', control: { type: 'range', min: 0, max: 100, step: 0.1 } },
  openAmountInCents: { description: 'Open amount', control: { type: 'range', min: 0, max: 100000, step: 100 } },
  size: { description: 'Size of the component', control: { type: 'select', options: ['default', 'small'] } },
  style: { description: 'Wrapper style override', control: false },
}

Primary.args = {
  donationsCount: 10,
  category: 'Climate',
  progressPercentage: 87.4,
  openAmountInCents: 12345,
  size: 'default',
  style: {},
}
