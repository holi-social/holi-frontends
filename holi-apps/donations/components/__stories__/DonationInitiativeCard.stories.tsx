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
  pictureUrl: { description: 'Initiative picture links', control: { type: 'text' } },
  name: { description: 'Initiative name', control: { type: 'text' } },
  city: { description: 'Initiative city', control: { type: 'text' } },
  country: { description: 'Initiative country', control: { type: 'text' } },
  link: { description: 'Links to the external initiative website', control: { type: 'text' } },
  projectSummary: { description: 'Initiative summary', control: { type: 'text' } },
  projectDescription: { description: 'Initiative description', control: { type: 'text' } },
}

Primary.args = {
  pictureUrl:
    'https://betterplace-assets.betterplace.org/uploads/organisation/profile_picture/000/002/104/fill_200x200_bp1488189166_German_Red_Cross_Logo_4c.jpg',
  name: 'Deutsches Rotes Kreuz',
  city: 'Kiew',
  country: 'Ukraine',
  link: 'https://www.betterplace.org/de/organisations/2104-deutsches-rotes-kreuz-e-v',
  projectSummary:
    'Angesichts der fortschreitenden Eskalation der Lage in der Ukraine weitet das Deutsche Rote Kreuz (DRK) die Unterstützung für seine Schwestergesellschaft, das Ukrainische Rote Kreuz (URK), weiter aus.',
  projectDescription:
    'Angesichts der sich ausweitenden Kampfhandlungen bereiten wir umfassende Hilfsmaßnahmen für die Bevölkerung in der Ukraine sowie Menschen auf der Flucht vor, um Leben zu schützen und Menschen in Not zu versorgen. Mit einem bereits angelaufenen Soforthilfe-Projekt stellen wir eine flexible Unterstützung bereit, um der Bedarfslage vor Ort entsprechend schnellstmöglich bestehende Projekte auszuweiten und weitere Maßnahmen zur Unterstützung der ukrainischen Bevölkerung umsetzen zu können. Die zivile Bevölkerung und besonders verletzliche Menschen benötigen nun dringend unsere Hilfe. Danke vorab für eure Unterstützung! Euer DRK-Team ❤',
}
