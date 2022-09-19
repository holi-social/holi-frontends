import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import DonationInitiativeCard from '@holi-apps/donations/components/DonationInitiativeCard'

export default {
  title: 'Donations/Organisms/DonationInitiativeCard',
  component: DonationInitiativeCard,
} as ComponentMeta<typeof DonationInitiativeCard>

const Template: ComponentStory<typeof DonationInitiativeCard> = ({ ...args }) => <DonationInitiativeCard {...args} />

export const Primary: ComponentStory<typeof DonationInitiativeCard> = Template.bind({})

Primary.argTypes = {
  pictureURL: { description: 'Carrier picture links', control: { type: 'text' } },
  name: { description: 'Carrier name', control: { type: 'text' } },
  city: { description: 'Carrier city', control: { type: 'text' } },
  country: { description: 'Carrier country', control: { type: 'text' } },
  link: { description: 'Links to the external carrier website', control: { type: 'text' } },
}

Primary.args = {
  pictureURL:
    'https://betterplace-assets.betterplace.org/uploads/organisation/profile_picture/000/002/104/fill_200x200_bp1488189166_German_Red_Cross_Logo_4c.jpg',
  name: 'Deutsches Rotes Kreuz',
  city: 'Kiew',
  country: 'Ukraine',
  link: 'https://www.betterplace.org/de/organisations/2104-deutsches-rotes-kreuz-e-v',
}
