import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import DonationInitiativeButton from '@holi-apps/donations/components/DonationInitiativeButton'

export default {
  title: 'Donations/Organisms/DonationInitiativeCard',
  component: DonationInitiativeButton,
} as ComponentMeta<typeof DonationInitiativeButton>

const Template: ComponentStory<typeof DonationInitiativeButton> = ({ ...args }) => (
  <DonationInitiativeButton {...args} />
)

export const Primary: ComponentStory<typeof DonationInitiativeButton> = Template.bind({})

Primary.argTypes = {
  pictureUrl: { description: 'Initiative picture links', control: { type: 'text' } },
  name: { description: 'Initiative name', control: { type: 'text' } },
  city: { description: 'Initiative city', control: { type: 'text' } },
  country: { description: 'Initiative country', control: { type: 'text' } },
  link: { description: 'Links to the external initiative website', control: { type: 'text' } },
}

Primary.args = {
  pictureUrl:
    'https://betterplace-assets.betterplace.org/uploads/organisation/profile_picture/000/002/104/fill_200x200_bp1488189166_German_Red_Cross_Logo_4c.jpg',
  name: 'Deutsches Rotes Kreuz',
  city: 'Kiew',
  country: 'Ukraine',
  link: 'https://www.betterplace.org/de/organisations/2104-deutsches-rotes-kreuz-e-v',
}
