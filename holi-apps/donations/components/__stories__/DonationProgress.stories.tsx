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
  currency: { description: 'Currency symbol', control: { type: 'select', options: ['EUR', 'GBP', 'JPY'] } },
  currencyLocale: { description: 'Currency locale', control: { type: 'select', options: ['de-DE', 'en-GB', 'ja-JP'] } },
  noOfdonations: { description: 'Number of donations', control: { type: 'number' } },
  donationsLabel: { description: 'Label/tag for the donations', control: { type: 'text' } },
  goal: { description: "Project's donation goal amount", control: { type: 'range', min: 0, max: 1000, step: 1 } },
  total: {
    description: "Project's current total donations amount",
    control: { type: 'range', min: 0, max: 1000, step: 1 },
  },
  size: { description: 'Size of the component', control: { type: 'select', options: ['default', 'small'] } },
  style: { description: 'Wrapper style override', control: false },
}

Primary.args = {
  currency: 'EUR',
  currencyLocale: 'de-DE',
  noOfdonations: 10,
  donationsLabel: 'Climate',
  goal: 1000,
  total: 500,
  size: 'default',
  style: {},
}
