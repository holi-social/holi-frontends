import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import DonationButton from '@holi-apps/donations/components/DonationButton'

export default {
  title: 'Donations/Organisms/DonationButton',
  component: DonationButton,
} as ComponentMeta<typeof DonationButton>

const Template: ComponentStory<typeof DonationButton> = ({ ...args }) => <DonationButton {...args} />

export const Primary: ComponentStory<typeof DonationButton> = Template.bind({})

Primary.argTypes = {
  name: { description: 'Initiative name', control: { type: 'text' } },
  link: { description: 'Links to the external initiative website', control: { type: 'text' } },
}

Primary.args = {
  name: 'Deutsches Rotes Kreuz',
  link: 'https://www.betterplace.org/de/projects/106501-nothilfe-ukraine',
}
