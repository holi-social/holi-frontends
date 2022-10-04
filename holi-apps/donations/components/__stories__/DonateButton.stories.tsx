import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import DonateButton from '@holi-apps/donations/components/DonateButton'

export default {
  title: 'Donations/Organisms/DonateButton',
  component: DonateButton,
} as ComponentMeta<typeof DonateButton>

const Template: ComponentStory<typeof DonateButton> = ({ ...args }) => <DonateButton {...args} />

export const Primary: ComponentStory<typeof DonateButton> = Template.bind({})

Primary.argTypes = {
  icon: { description: 'icon name', control: { type: 'text' } },
  label: { description: 'button label', control: { type: 'text' } },
  link: { description: 'Link to the external initiative website', control: { type: 'text' } },
}

Primary.args = {
  icon: 'share-box',
  label: 'donations:projectDetail.donate',
  link: 'https://www.betterplace.org/de/projects/106501-nothilfe-ukraine',
}
