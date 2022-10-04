import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import DonationInitiativeButton from '@holi-apps/donations/components/DonationInitiativeButton'
import { PictureType, ProjectInitiative } from '@holi-apps/donations/typings'

const initiativeData: ProjectInitiative = {
  id: 1,
  name: 'Deutsches Rotes Kreuz',
  city: 'Kiew',
  country: 'Ukraine',
  url: 'https://www.betterplace.org/de/organisations/2104-deutsches-rotes-kreuz-e-v',
  picture: [
    {
      type: 'PictureType' as PictureType,
      url: 'https://betterplace-assets.betterplace.org/uploads/organisation/profile_picture/000/002/104/fill_200x200_bp1488189166_German_Red_Cross_Logo_4c.jpg',
    },
  ],
}

export default {
  title: 'Donations/Organisms/DonationInitiativeButton',
  component: DonationInitiativeButton,
} as ComponentMeta<typeof DonationInitiativeButton>

const Template: ComponentStory<typeof DonationInitiativeButton> = ({ ...args }) => (
  <DonationInitiativeButton {...args} />
)

export const Primary: ComponentStory<typeof DonationInitiativeButton> = Template.bind({})

Primary.argTypes = {
  initiative: {
    defaultValue: initiativeData,
  },
}

Primary.args = {
  initiative: initiativeData,
}
