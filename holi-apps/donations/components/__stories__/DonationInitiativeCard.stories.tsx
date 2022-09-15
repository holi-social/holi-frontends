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
  carrierPictureLinks: { description: 'Carrier picture links', control: { type: 'text' } },
  carrierName: { description: 'Carrier name', control: { type: 'text' } },
  carrierCity: { description: 'Carrier city', control: { type: 'text' } },
  carrierCountry: { description: 'Carrier country', control: { type: 'text' } },
  category: { description: 'Label/tag for the initiative', control: { type: 'text' } },
  carrierLinks: { description: 'Links to the external carrier website', control: { type: 'text' } },
  summary: { description: 'Initiative headline text', control: { type: 'text' } },
  description: { description: 'Description of the initiative', control: { type: 'text' } },
}

Primary.args = {
  carrierPictureLinks:
    'https://betterplace-assets.betterplace.org/uploads/organisation/profile_picture/000/002/104/fill_200x200_bp1488189166_German_Red_Cross_Logo_4c.jpg',
  carrierName: 'Deutsches Rotes Kreuz',
  carrierCity: 'Kiew',
  carrierCountry: 'Ukraine',
  category: 'War in Ukraine',
  carrierLinks: 'https://www.betterplace.org/de/organisations/2104-deutsches-rotes-kreuz-e-v',
  summary:
    'With the situation in Ukraine remaining critical, the German Red Cross (GRC) is further expanding its support for its sister organization, the Ukrainian Red Cross (URK).',
  description:
    'Angesichts der sich ausweitenden Kampfhandlungen bereiten wir umfassende Hilfsmaßnahmen für die Bevölkerung in der Ukraine sowie Menschen auf der Flucht vor, um Leben zu schützen und Menschen in Not zu versorgen.',
}
